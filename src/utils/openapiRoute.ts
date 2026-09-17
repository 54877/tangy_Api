import { registry } from "../config/openapiRegister";
import { validateRequest } from "../middlewares/validateRequest";

export const openapiRoute = ({
  method,
  path,
  tags,
  summary,
  schema,
  handler,
  router,
  needAuth = false,
  formData = false,
  middlewares = [],
  extraProperties = {},
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

    ...(schema && {
      request: {
        body: {
          content: {
            [formData ? "multipart/form-data" : "application/json"]: {
              schema: {
                ...schema,
                ...(formData && {
                  properties: {
                    ...schema.properties,
                    ...extraProperties,
                  },
                }),
              },
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
