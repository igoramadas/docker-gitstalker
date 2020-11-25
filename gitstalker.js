// GITSTALKER

console.log("Executing the GitStalker...")
console.log("")

const fs = require("fs")
const shell = require("shelljs")

// Default environment prefix is "gitstalker_" and mount point is /repos.
const prefix = "gitstalker"
const repoFolder = "/repos"

// Iterate environment variables to run the repoStalk.
try {
    const env = Object.entries(process.env)

    for (let [key, value] of env) {
        const arrKey = key.split("_")
        const keyPrefix = arrKey[0].toLowerCase()

        if (keyPrefix == prefix) {
            repoStalk(arrKey[1], value)
        }
    }
} catch (ex) {
    console.error(ex)
}

// Clone or pull the specified repo.
function repoStalk(name, address) {
    try {
        const repoPath = `${repoFolder}/${name}`

        if (fs.existsSync(repoPath)) {
            shell.cd(repoPath)
            shell.exec(`git pull`)
        } else {
            shell.cd(repoFolder)
            shell.exec(`git clone ${address} ${name}`)
        }
    } catch (ex) {
        console.error(ex)
    }
}
