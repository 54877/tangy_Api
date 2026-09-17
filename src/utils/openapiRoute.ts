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

  const schemaRequired = Array.isArray(schema?.required) ? schema.required : [];

  const required = [...schemaRequired, ...requiredProperties];

  const requestSchema = formData
    ? {
        ...schema,
        properties: {
          ...schema?.properties,
          ...extraProperties,
        },
        ...(required.length > 0 && {
          required,
        }),
      }
    : schema;

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
