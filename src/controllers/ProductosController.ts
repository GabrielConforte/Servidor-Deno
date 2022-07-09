import { init, MongoClient, Database, Collection } from "https://deno.land/x/mongo/mod.ts";

export interface DatabaseOptions{
    hostname: string;
    port: number;
    db: string;
    username: string;
    password: string;
}

export interface Productos{
    id: string;
    nombre: string;
    precio: number;
    descripcion: string;
    imagen: string;
}

export enum ProductosResponseStatus{
    OK,
    ERROR,
    PRODUCTO_NO_ENCONTRADO,
    DATA_INVALID,
    ERROR_DE_SERVIDOR,
    PRODUCTO_MODIFICADO
}

export interface ProductosResponse{
    status: ProductosResponseStatus;
    value: any | undefined;
}

export class ProductosController{

    private client = new MongoClient();
    private productos?: Collection;
    
    public async connectWithOptions(options: DatabaseOptions = { hostname: "localhost", port: 27017, db: "deno_db", username: "", password: "" }){
       await init();
       const { hostname, port, db, username, password } = options;
       let mongoUri: string = (username =="") ? `mongodb://${hostname}:${port}/${db}` : `mongodb://${username}:${password}@${hostname}:${port}/${db}`;
         this.productos = this.client.database(db).collection("productos");}


         public async getProductos(): Promise<ProductosResponse> {
            if(!this.productos) {
              return { status: ProductosResponseStatus.ERROR, value: "Error fetching users from database."};
            }
        
            const users = await this.productos.find({});
            users.forEach(function(user: any) {
              delete user._id;
            });
            return {status: ProductosResponseStatus.OK, value: users};
          }

            public async getProductoById(id: string): Promise<ProductosResponse> {
                if(!this.productos) {
                  return { status: ProductosResponseStatus.ERROR, value: "Error fetching users from database."};
                }
            
                const user = await this.productos.findOne({ id: id });
                delete user._id;
                return {status: ProductosResponseStatus.OK, value: user};
              }
            public async createProducto(producto: Productos): Promise<ProductosResponse> {
                if(!this.productos) {
                  return { status: ProductosResponseStatus.ERROR, value: "Error fetching users from database."};
                }
            
                const user = await this.productos.insertOne(producto);
                delete user._id;
                return {status: ProductosResponseStatus.OK, value: user};
              }

                public async updateProducto(id: string, producto: Productos): Promise<ProductosResponse> {
                    if(!this.productos) {
                      return { status: ProductosResponseStatus.ERROR, value: "Error fetching users from database."};
                    }
                
                    const user = await this.productos.updateOne({ id: id }, { $set: producto });
                    delete user._id;
                    return {status: ProductosResponseStatus.OK, value: user};
                  }
                public async deleteProducto(id: string): Promise<ProductosResponse> {
                    if(!this.productos) {
                      return { status: ProductosResponseStatus.ERROR, value: "Error fetching users from database."};
                    }
                
                    const user = await this.productos.deleteOne({ id: id });
                    delete user._id;
                    return {status: ProductosResponseStatus.OK, value: user};
                  }
                  
}
