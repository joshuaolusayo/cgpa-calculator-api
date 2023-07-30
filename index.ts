import { createTerminus, TerminusOptions } from "@godaddy/terminus";
import { Application } from "express";
import { Mongoose } from "mongoose";
import Environment from "./config/env";

interface ServerConfigModule {
  startServer: () => void;
}

export default function serverConfig(
  app: Application,
  mongoose: Mongoose,
  serverInit: any,
  config: { PORT: string; IP: string }
): ServerConfigModule {
  function healthCheck(): Promise<void> {
    if (
      mongoose.connection.readyState === 0 ||
      mongoose.connection.readyState === 3
    ) {
      return Promise.reject(new Error("Mongoose has disconnected"));
    }
    if (mongoose.connection.readyState === 2) {
      return Promise.reject(new Error("Mongoose is connecting"));
    }
    return Promise.resolve();
  }

  function onSignal(): Promise<void> {
    console.log("server is starting cleanup");
    return new Promise<void>((resolve, reject) => {
      mongoose
        .disconnect()
        .then(() => {
          console.info("Mongoose has disconnected");
          resolve();
        })
        .catch(reject);
    });
  }

  function beforeShutdown(): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, 15000);
    });
  }

  function onShutdown(): Promise<any> {
    return Promise.resolve(); // Modify this function as per your cleanup requirements
  }

  function startServer(): void {
    const terminusOptions: TerminusOptions = {
      logger: console.log,
      signal: "SIGINT",
      healthChecks: {
        "/healthcheck": healthCheck,
      },
      onSignal,
      onShutdown,
      beforeShutdown,
    };

    createTerminus(serverInit, terminusOptions).listen(
      config.PORT,
      config.IP,
      () => {
        console.log(
          "Express server listening on %d, in %s mode",
          config.PORT,
          Environment.IP
        );
      }
    );
  }

  return {
    startServer,
  };
}
