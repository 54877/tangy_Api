import { registry } from "../config/openapiRegister";
import { validateRequest } from "../middlewares/validateRequest";

export const openapiRoute = ({
  method,
  path,
  tags,
  summary,
  schema,
  openapiSchema = schema,
  handler,
  router,
  needAuth = false,
  formData = false,
  middlewares = [],
}: any) => {
  registry.registerPath({
    method,
    path,
    tags,
    summary,

    ...(needAuth && {
      security: [
        {
          bearerAuth: [],
        },
      ],
    }),

    ...(openapiSchema && {
      request: {
        body: {
          content: {
            [formData ? "multipart/form-data" : "application/json"]: {
              schema: openapiSchema,
            },
          },
        },
      },
    }),

    responses: {
      200: {
        description: "success",
      },
    },
  });

  router[method](
    path,
    ...middlewares,
    ...(schema ? [validateRequest(schema)] : []),
    ...handler,
  );
};
