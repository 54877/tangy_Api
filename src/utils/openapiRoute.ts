import { registry } from "../config/openapiRegister";

export const openapiRoute = ({
  method,
  path,
  tags,
  summary,
  schema,
  handler,
  router,
}: any) => {
  registry.registerPath({
    method,
    path,
    tags,
    summary,
    request: {
      body: {
        content: {
          "application/json": {
            schema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "success",
      },
    },
  });

  router[method](path, handler);
};
