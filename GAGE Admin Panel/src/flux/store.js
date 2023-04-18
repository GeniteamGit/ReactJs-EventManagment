import {EventEmitter} from "events";

import Dispatcher from "./dispatcher";
import Constants from "./constants";
import getSidebarNavItems from "../data/sidebar-nav-items";

let _store = {
    menuVisible: false,
    activeLink: {current: "Select Event", prev: "Select Event"},
    showEventInfo: false,
    modal: false,
    // mainEventId : null,
    // report : null,
    navItems: getSidebarNavItems(
        localStorage.getItem("eventId"),
        localStorage.getItem("report"),
        localStorage.getItem("dashboard")
    ),
};

class Store extends EventEmitter {
    constructor() {
        super();
        this._listeners = new Set();
        this.registerToActions = this.registerToActions.bind(this);
        this.toggleSidebar = this.toggleSidebar.bind(this);
        Dispatcher.register(this.registerToActions.bind(this));
    }

    registerToActions({actionType, payload}) {
        switch (actionType) {
            case Constants.TOGGLE_SIDEBAR:
                this.toggleSidebar();
                break;
            case "activeLinkCurrent":
                this.activeLinkCurrent(payload);
                break;
            case "activeLinkPrev":
                this.activeLinkPrev(payload);
                break;
            case "setNavItems" :
                this.setNavItems(payload);
                break;
            case "toggleShowEventInfo" :
                this.toggleEventInfo();
                break;
            case "resetValue" :
                this.resetValue();
                break;
            case "toggleModal" :
                this.toggleModal();
                break;
            default:
        }
    }

    toggleModal() {
        
        _store.modal = !_store.modal;
    }

    getModal() {
        return _store.modal;
    }

    resetValue() {
        _store.showEventInfo = false;
    }

    listen(cb) {
        this._listeners.add(cb);
        
    }

    unlisten(cb) {
        this._listeners.delete(cb);
    }

    _emitChange() {
        this._listeners.forEach(cb => cb());
    }

    componentDidMount() {
    }

    toggleEventInfo() {
        
        _store.showEventInfo = !_store.showEventInfo;
        this._emitChange();
    }

    getShowEventInfo() {
        return _store.showEventInfo;
    }

    setNavItems(_payload) {
        _store.navItems = getSidebarNavItems(_payload.eventId, _payload.report);
    }

    activeLinkCurrent(_payload) {
        _store.activeLink.current = _payload;
    }

    activeLinkPrev(_payload) {
        _store.activeLink.prev = _payload;
    }

    getActiveLink() {
        return _store.activeLink;
    }

    toggleSidebar() {
        _store.menuVisible = !_store.menuVisible;
        this.emit(Constants.CHANGE);
    }

    getMenuState() {
        return _store.menuVisible;
    }

    getSidebarItems() {
        return _store.navItems;
    }


    addChangeListener(callback) {
        this.on(Constants.CHANGE, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(Constants.CHANGE, callback);
    }
}

export default new Store();
