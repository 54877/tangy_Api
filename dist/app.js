"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const errors_js_1 = require("./utils/errors.js");
const auth_router_js_1 = require("./routes/auth_router.js");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_js_1 = require("./config/swagger.js");
const app = (0, express_1.default)();
app.disable("x-powered-by");
//跨網域設定
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "https://54877.github.io",
        "http://localhost:5174",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
// 解析 JSON 格式的請求體
app.use(express_1.default.json());
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_js_1.swaggerSpec));
//api
app.use("/auth", auth_router_js_1.auth_router);
app.use(errors_js_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map