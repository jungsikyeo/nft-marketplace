const KryptoBird = artifacts.require("Kryptobird");

module.exports = function (deployer) {
  deployer.deploy(KryptoBird);
};
