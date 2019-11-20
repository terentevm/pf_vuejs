import ApiClass from '../../api/api_laravel';

const api = new ApiClass();

// initial state
const state = {
    contacts: [],
    contactFormData: {
        id: null,
        name: '',
        phone: '',
        email: ''
    },
};

// getters
const getters = {

    contacts: state => state.contacts,
    contactFormData: state => state.formData,

    name: state => state.contactFormData.name,
    phone: state => state.contactFormData.phone,
    email: state => state.contactFormData.email,
};

// actions
const actions = {
    async getContacts({commit}) {
        let data = [];

        try {
            data = await api.index('contacts');
            commit('setContacts', data);
        }
        catch (err) {
            console.dir(err);
        }

    },

    async storeContact({commit}) {

        let id = this.state.contacts.contactFormData.id;

        let promise = id == null
            ? api.store('contacts', this.state.contacts.contactFormData)
            : api.update('contacts', id, this.state.contacts.contactFormData);

        return promise;

    },

    editContact({commit}, contact) {
        commit('setContactFormData', Object.assign({}, contact));
    }
};

// mutations
const mutations = {

    setContacts(state, data) {
        data.forEach(contact => {
            if (state.contacts.find(current => current.id === contact.id) == undefined) {
                contact.active = true;
                state.contacts.push(contact);
            }
        });

    },

    setContactFormData(state, contact) {
        state.contactFormData = contact;
    },

    setContactName(sate, name) {
        state.contactFormData.name = name;
    },

    setContactPhone(sate, phone) {
        state.contactFormData.phone = phone;
    },

    setContactEmail(sate, email) {
        state.contactFormData.email = email;
    }

};

export default {
    state,
    getters,
    actions,
    mutations,
};
