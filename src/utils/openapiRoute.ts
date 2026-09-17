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
  requiredProperties = [],
}: any) => {
  const hasSchema = schema !== undefined && schema !== null;

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

    ...(hasSchema && {
      request: {
        body: {
          content: {
            [formData ? "multipart/form-data" : "application/json"]: {
              schema: formData
                ? {
                    type: "object",
                    properties: {
                      ...schema.shape,
                      ...extraProperties,
                    },
                    required: requiredProperties,
                  }
                : schema,
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
    ...(hasSchema ? [validateRequest(schema)] : []),
    ...handler,
  );
};
