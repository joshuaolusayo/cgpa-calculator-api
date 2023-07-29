// import express from "express";
import { Express, Request, Response, NextFunction } from "express";
// import morgan from "morgan";
import bodyParser from "body-parser";
import helmet from "helmet";

export default function expressConfig(app: Express): void {
  // Security middleware
  app.use(helmet());

  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(
    bodyParser.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50000,
    })
  );

  app.use((req: Request, res: Response, next: NextFunction) => {
    // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', 'http://some-accepted-origin');
    // Request methods you wish to allow
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    // Request headers you wish to allow
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, Content-type, Authorization, Cache-control, Pragma"
    );
    // Pass to next layer of middleware
    next();
  });

  // app.use(morgan("combined"));
}
