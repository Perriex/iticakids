import store from "store";

const get = (slug) => {
    try {
        const settings = store.get("user").site.site_settings;
        let setting = settings.find(k => k.slug == slug);
        return setting.value;
    } catch (error) {
        return false;
    }
}

const getFrom = (slug , prop) => {
    try {
        const settings = store.get("user").site.site_settings;
        let setting = settings.find(k => k.slug == slug);
        let data = JSON.parse(setting.value);
        return data[prop];
    } catch (error) {
        return false;
    }
}


export default {
    get : get,
    getFrom : getFrom
};