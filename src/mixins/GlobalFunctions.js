const mixin = {
    methods: {
        copyObject(objDest, objSource) {
            for (let propName in objDest) {
                if (objSource.hasOwnProperty(propName)) {
                    objDest[propName] = objSource[propName];
                }
            }
        },
    }
};

export default mixin;