// Math is an object, no need to use prototype keyword
Math.getRandomHash = function() {
    var s1, s2;
    s1 = String(Math.floor(Math.random()*1000));
    s2 = String(new Date().getTime());

    return s1 + s2;
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

Array.prototype.removeByIndex = function(index) {
    if (index > -1) {
      this.splice(index, 1);
    }
};

Array.prototype.removeByObject = function(object) {
    for(var i=0; i<this.length; i++) {
      if(this[i] == object) {
        this.removeByIndex(i);
      }
    }
};

// Scroll to animation
function scrollTo($dom, duration) {
    $('html, body').animate({
        scrollTop: $dom.offset().top
    }, duration);
}

function getId() {
    var id = Cookies.get('js_id');

    if(!id) {
        id = 0;
    }

    id = parseInt(id);
    id++;
    Cookies.set('js_id', id);

    return id;
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

var version = getId();

var viewList = [];
function v(path) {
    var $return = path + '?v=' + version;

    viewList.push($return);

    return $return;
}

// Path list
var viewPath = '/build/views/';
var path = {
    dashboard: v('/build/views/dashboard.html'),

    profit: {
        hierarchy: {
            index: v('/build/views/profit.hierarchy.html')
        },
        downline: {
            index: v('/build/views/profit.downline.earning.html')
        },
    },

    account: {
        status: {
            index: v('/build/views/account.status.html'),
        },

        user: {
            index: v('/build/views/user.html'),
            create: v('/build/views/user.create.html')
        },

        mpin: {
            index: v('/build/views/account.mpin.html')
        },

        customer: {
            index: v('/build/views/account.customer.html')
        },
    
        profile: {
            update: v('/build/views/account.profile.update.html')
        },
    },

    setting: {
        level: {
            index: v('/build/views/setting.level.html'),
            create: v('/build/views/setting.level.create.html'),
        },

        permission: {
            index: v('/build/views/setting.permission.html'),
            create: v('/build/views/setting.permission.create.html'),
        },

        roletype: {
            index: v('/build/views/setting.roletype.html'),
            create: v('/build/views/setting.roletype.create.html'),
            setPermission: v('/build/views/setting.roletype.set-permission.html')
        }
    },

    component: {
        boxOverlay: v('/build/libs/components/box.overlay.html'),
        buttonLoading: v('/build/libs/components/button.loading.html'),
        alertMessage: v('/build/libs/components/alert.message.html'),
        popUp: v('/build/libs/components/popup.modal.html'),
        flashMessage: v('/build/libs/components/flash-message.html'),
        flashMessageStacked: v('/build/libs/components/flash-message-stacked.html'),
        paging: v('/build/libs/components/paging.html'),
        sortable: v('/build/libs/components/sortable.html')
    }
};
