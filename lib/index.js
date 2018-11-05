"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
var lodash_get_1 = __importDefault(require("lodash.get"));
var CHECK_NAME = 'nvmrc';
var NVMRC_FILE_PATH = '.nvmrc';
var nvmRcExists = function (context, repository) { return __awaiter(_this, void 0, void 0, function () {
    var _a, owner, repo, content, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = repository.split('/'), owner = _a[0], repo = _a[1];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, context.github.repos.getContent({ owner: owner, repo: repo, path: NVMRC_FILE_PATH })];
            case 2:
                content = _b.sent();
                context.log.info({ data: content.data }, "Recevived content for " + NVMRC_FILE_PATH);
                return [2 /*return*/, true];
            case 3:
                err_1 = _b.sent();
                context.log.error(err_1, NVMRC_FILE_PATH + " not found");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, false];
        }
    });
}); };
var createCheck = function (context) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/];
    });
}); };
module.exports = function (app) {
    app.on('integration_installation.created', function (context) { return __awaiter(_this, void 0, void 0, function () {
        var repo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    context.log.info({ payload: context.payload });
                    return [4 /*yield*/, context.github.repos.get({ repo: 'hackathon-starter', owner: 'vymarkov' })];
                case 1:
                    repo = _a.sent();
                    context.log.info({ repo: repo });
                    return [2 /*return*/];
            }
        });
    }); });
    app.on('issues.opened', function (context) { return __awaiter(_this, void 0, void 0, function () {
        var issueComment;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    issueComment = context.issue({ body: 'Thanks for opening this issue!' });
                    return [4 /*yield*/, context.github.issues.createComment(issueComment)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    app.on('pull_request.opened', function (context) { return __awaiter(_this, void 0, void 0, function () {
        var _a, owner, repo, repository, commits, headSha, checks;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = context.payload.repository.full_name.split('/'), owner = _a[0], repo = _a[1];
                    return [4 /*yield*/, context.github.repos.get({ repo: repo, owner: owner })];
                case 1:
                    repository = _b.sent();
                    context.log.info({ data: repository.data }, 'Repository');
                    return [4 /*yield*/, context.github.pullRequests.getCommits({ owner: owner, repo: repo, page: 1, per_page: 1, number: 1 })];
                case 2:
                    commits = _b.sent();
                    context.log.info({ commits: commits });
                    headSha = lodash_get_1.default(commits, 'data[0].sha');
                    return [4 /*yield*/, context.github.checks.listSuitesForRef({ owner: owner, repo: repo, ref: headSha, check_name: 'nvmrc' })
                        // // get(checks, 'data.check_suites', [])
                    ];
                case 3:
                    checks = _b.sent();
                    // // get(checks, 'data.check_suites', [])
                    context.log.info({ checks: checks });
                    return [2 /*return*/];
            }
        });
    }); });
    app.on('pull_request.synchronize', function (context) { return __awaiter(_this, void 0, void 0, function () {
        var _a, owner, repo, commits, lastCommit, ref, checks;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = context.payload.repository.full_name.split('/'), owner = _a[0], repo = _a[1];
                    return [4 /*yield*/, context.github.pullRequests.getCommits({ owner: owner, repo: repo, page: 1, per_page: 10, number: 1 })];
                case 1:
                    commits = _b.sent();
                    lastCommit = commits.data.pop();
                    context.log.info({ lastCommit: lastCommit });
                    ref = lastCommit ? lastCommit.sha : '';
                    return [4 /*yield*/, context.github.checks.listSuitesForRef({ owner: owner, repo: repo, ref: ref, check_name: CHECK_NAME })];
                case 2:
                    checks = _b.sent();
                    context.log.info({ checks: checks });
                    if (checks.data.check_suites.length === 0) {
                        //
                    }
                    return [4 /*yield*/, nvmRcExists(context, context.payload.repository.full_name)];
                case 3:
                    if (_b.sent()) {
                        context.log.info('.nvmrc is found, create a check with success status');
                    }
                    else {
                        context.log.warn('.nvmrc not found, create a check with warning status');
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    // For more information on building apps:
    // https://probot.github.io/docs/
    // To get your app running against GitHub, see:
    // https://probot.github.io/docs/development/
};
//# sourceMappingURL=index.js.map