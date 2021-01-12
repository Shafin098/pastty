const cmd = require('./cmd')

// Adds rule to firewall inbound to allow connection on specific port
function removeFirewallOnPort(port) {
    if (process.platform != 'win32') {
        return
    }
    const ALLOW_CONNECTION_ON_PORT_COMMAND = `netsh advfirewall firewall add rule name="Pastty" dir=in action=allow protocol=TCP localport=${port}`
    cmd.runCommand(ALLOW_CONNECTION_ON_PORT_COMMAND)
}

// Remove previously created rule to allow connection on specific port
function resetFirewallToPreviousState(port) {
    if (process.platform != 'win32') {
        return
    }
    const BLOCK_CONNECTION_ON_PORT_COMMAND = `netsh advfirewall firewall delete rule name="Pastty" dir=in protocol=TCP localport=${port}`
    cmd.runCommand(BLOCK_CONNECTION_ON_PORT_COMMAND)
}

module.exports = {
    removeFirewallOnPort,
    resetFirewallToPreviousState
}