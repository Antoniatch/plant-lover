module.exports = async function (): Promise<void> {
    await globalThis.testServer.stop();
};
