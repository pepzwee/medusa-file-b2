"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var fs = require('fs');

var aws = require('aws-sdk');

var _require = require('medusa-interfaces'),
    FileService = _require.FileService;

var B2Service = /*#__PURE__*/function (_FileService) {
  _inherits(B2Service, _FileService);

  var _super = _createSuper(B2Service);

  function B2Service(_ref, options) {
    var _this;

    _objectDestructuringEmpty(_ref);

    _classCallCheck(this, B2Service);

    _this = _super.call(this);
    _this._bucket = options.bucket;
    _this._accessKeyId = options.access_key_id;
    _this._secretAccessKey = options.secret_access_key;
    _this._region = options.region;
    _this._endpoint = options.endpoint;
    aws.config.credentials = new aws.SharedIniFileCredentials({
      profile: 'b2'
    });
    aws.config.update({
      accessKeyId: _this._accessKeyId,
      secretAccessKey: _this._secretAccessKey,
      region: _this._region
    });
    _this._s3 = new aws.S3({
      endpoint: new aws.Endpoint(_this._endpoint)
    });
    return _this;
  }

  _createClass(B2Service, [{
    key: "upload",
    value: function upload(file) {
      var _this2 = this;

      var params = {
        ACL: "public-read",
        Bucket: this._bucket,
        Body: fs.createReadStream(file.path),
        Key: "".concat(file.originalname)
      };
      return new Promise(function (resolve, reject) {
        _this2._s3.upload(params, function (err, data) {
          if (err) {
            reject(err);
            return;
          }

          resolve({
            url: data.Location
          });
        });
      });
    }
  }, {
    key: "delete",
    value: function _delete(file) {
      var _this3 = this;

      var params = {
        Bucket: this._bucket,
        Key: "".concat(file)
      };
      return new Promise(function (resolve, reject) {
        _this3._s3.deleteObject(params, function (err, data) {
          if (err) {
            reject(err);
            return;
          }

          resolve(data);
        });
      });
    }
  }]);

  return B2Service;
}(FileService);

var _default = B2Service;
exports["default"] = _default;