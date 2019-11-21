var express = require("express");
var router = express.Router();

const { UserController } = require('../controllers/Api/UserController');
const { AccountController } = require('../controllers/Api/AccountController');
const { AccountMpinController } = require('../controllers/Api/AccountMpinController');
const { CustomerController } = require('../controllers/Api/CustomerController');
const { ProfitController } = require('../controllers/Api/ProfitController');
const { RoleTypeController } = require('../controllers/Api/RoleTypeController');
const { SettingController } = require('../controllers/Api/SettingController');
const { auth } = require('../controllers/AuthController');
const middleware = require('../middleware/Auth');

router.post('/login', auth.signIn);
router.post('/register', auth.register);
// Account user
router.post('/account/user/create', middleware(['account_user_create', 'account_user_update']).isAuth, AccountController.store_user);
router.get('/account/user/list', middleware(['account_user_list']).isAuth, AccountController.index_user);
router.get('/account/user/detail/:id', middleware(['account_user_detail']).isAuth, AccountController.detail_user);
router.delete('/account/user/delete/:id', middleware(['account_user_delete']).isAuth, AccountController.delete_user);

// Account status
router.get('/account/status/list', middleware(['account_status_list']).isAuth, AccountController.index_status);
router.get('/account/status/count', middleware(['none']).isAuth, AccountController.approval_to_approved);
router.put('/account/status/approved', middleware(['account_status_approved']).isAuth, AccountController.approved);

// Account MPIN
router.get('/account/mpin/list', middleware(['account_mpin_list']).isAuth, AccountMpinController.index);
router.post('/account/mpin/create', middleware(['account_mpin_generate']).isAuth, AccountMpinController.generate);
router.get('/account/mpin/count', middleware(['none']).isAuth, AccountMpinController.count);
router.get('/account/mpin/count-per-month', middleware(['none']).isAuth, AccountMpinController.count_per_month);
router.get('/account/mpin/count-utilization-per-month', middleware(['none']).isAuth, AccountMpinController.count_utilization_per_month);

// Profile
router.get('/profile', middleware(['none']).isAuth, UserController.profile);
router.put('/profile/update', middleware(['none']).isAuth, UserController.profile_update);

// Balance
router.get('/balance', middleware(['none']).isAuth, CustomerController.balance);

// Profit
router.get('/profit/hierarchy', middleware(['profit_hierarchy']).isAuth, ProfitController.index_hierarchy);
router.get('/profit/downline-earning', middleware(['none']).isAuth, ProfitController.index_downline_earning);
router.get('/profit/count-downline-earning', middleware(['none']).isAuth, ProfitController.count_downline_earning);

// Role Types
router.get('/role-type', middleware(['none']).isAuth, RoleTypeController.index);

// Setting Level
router.get('/setting/level/list', middleware(['setting_level_list']).isAuth, SettingController.index_level);
router.post('/setting/level/create', middleware(['setting_level_create','setting_level_update']).isAuth, SettingController.store_level);
router.get('/setting/level/detail/:id', middleware(['setting_level_detail']).isAuth, SettingController.show_level);

// Setting Permission
router.get('/setting/permission/list', middleware(['setting_permission_list']).isAuth, SettingController.index_permission);
router.post('/setting/permission/create', middleware(['setting_level_create','setting_permission_update']).isAuth, SettingController.store_permission);
router.get('/setting/permission/detail/:id', middleware(['setting_permission_detail']).isAuth, SettingController.show_permission);

// Setting Jabatan
router.get('/setting/role-type/list', middleware(['setting_roletype_list']).isAuth, SettingController.index_role_type);
router.post('/setting/role-type/create', middleware(['setting_roletype_create','setting_roletype_update']).isAuth, SettingController.store_permission);
router.get('/setting/role-type/detail/:id', middleware(['setting_roletype_detail']).isAuth, SettingController.show_role_type);
router.get('/setting/role-type/:id/permission', middleware(['setting_roletype_permission_view']).isAuth, SettingController.get_permission);
router.post('/setting/role-type/set-permission', middleware(['setting_roletype_permission_set']).isAuth, SettingController.set_permission);

// Customer
router.get('/account/customer/list', middleware(['account_customer_list']).isAuth, CustomerController.index);
router.get('/account/customer/count', middleware(['account_customer_list']).isAuth, CustomerController.downline_count);

router.get("/", function(req,res) {
    res.status(500).send({
        success: false,
        message: "Maaf data tidak tersedia"
    })
});

module.exports = router;