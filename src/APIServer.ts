import { Application, Router, Context, Status, STATUS_TEXT } from "https://deno.land/x/oak/mod.ts";
import { green, cyan, bold } from "https://deno.land/std@0.51.0/fmt/colors.ts";

export interface ServerOptions {
  port: number;
  hostname: string;
}

export class APIServer {

  private app = new Application();
  private router = new Router({methods: ["DELETE", "GET", "POST", "PUT"]});
  private abortController = new AbortController();
  
  public hostname: string;
  public port: number;
  public isRunning: boolean = false;

  constructor(options: ServerOptions = { hostname: "localhost", port: 8080 }) {
    const {
      hostname,
      port,
    } = options;

    this.hostname = hostname;
    this.port = port;
    this.initLogger();
    //definicion de endpoints
    this.initEndpoints();
  }

  async startServer() {
    if (this.isRunning) {
      this.stopServer();
    }

    this.isRunning = true;
    const { signal } = this.abortController;
    console.log(bold(green("Running server at "))+bold(cyan(this.hostname+":"+this.port.toString())));
    await this.app.listen({ hostname: this.hostname, port: this.port, signal });
    console.log(bold(green("Server stoped")));
    this.isRunning = false;
  }

  stopServer() {
    console.log("Server will stop on next API request...");
    this.abortController.abort();
  }

  //endpoints
    private initEndpoints() {
    this.router.get("/", async (context) => {
        context.response.status = Status.OK;
        context.response.body = "Hello world!";

    }
    );
}

  private initLogger() {
    this.app.use(async (context, next) => {
      const start: number = performance.now(); // float value in miliseconds/microseconds
      await next();
      const duration: string = this.highPrecisionToHumanReadable(performance.now() - start);
      const status = STATUS_TEXT.get(context.response.status || Status.OK) || "OK";
      console.log(bold(this.getFormatedDatetime())+" "+bold(green(context.request.method))+" "+bold(cyan(context.request.url.pathname))+" status:"+bold(status)+" duration:"+bold(duration));
    });
  }

  private pad2(n: any) {
    return n < 10 ? '0' + n : n;
  }

  private getFormatedDatetime(): string {
    let date = new Date();
    return date.getFullYear().toString()+"/"+this.pad2(date.getMonth() + 1)+"/"+this.pad2( date.getDate())+" "+this.pad2( date.getHours())+":"+this.pad2( date.getMinutes() )+":"+this.pad2(date.getSeconds());
  }

  private highPrecisionToHumanReadable(value: number): string {
    let seconds = Math.trunc(value / 1000);
    let miliseconds = Math.trunc(value - (seconds * 1000));
    let microseconds = Math.trunc((value % 1) * 1000);

    if(!seconds && !miliseconds) return `${microseconds}μ`;
    else if(!seconds) return `${miliseconds}ms ${microseconds}μ`;
    else return `${seconds}s ${miliseconds}ms ${microseconds}μ`;
  }
}