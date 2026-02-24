export default {
  beforeUpdate() {
    throw new Error("Orders cannot be edited. You can only view or delete them.");
  },
};
