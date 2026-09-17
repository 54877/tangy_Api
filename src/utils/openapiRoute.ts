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

  let requestSchema = schema;

  if (hasSchema && formData) {
    requestSchema = {
      ...schema,
      properties: {
        ...schema.properties,
        ...extraProperties,
      },
      required: [
        ...(Array.isArray(schema.required) ? schema.required : []),
        ...requiredProperties,
      ],
    };
  }

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
              schema: requestSchema,
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
