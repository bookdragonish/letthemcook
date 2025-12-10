export default new Proxy(
    {},
    {
        get: (_target, prop) => prop
    }
);