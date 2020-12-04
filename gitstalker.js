// GITSTALKER

const fs = require("fs")
const shell = require("shelljs")

// Default environment prefix is "gitstalker_" and mount point is /repos.
const prefix = "gitstalker"
const repoFolder = "/repos"

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

// Iterate environment variables to run the repoStalk.
try {
    const envRepos = Object.entries(process.env)

    console.log(`GitStalker will now process ${envRepos.length} repos...`)
    console.log("")

    for (let [key, value] of envRepos) {
        const arrKey = key.split("_")
        const keyPrefix = arrKey[0].toLowerCase()
        const name = arrKey[1]

        if (keyPrefix == prefix) {
            repoStalk(name, value)
        }
    }
} catch (ex) {
    console.error(ex)
}
