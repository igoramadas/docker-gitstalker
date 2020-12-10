// GITSTALKER: REPO CLONING & PULLING

const fs = require("fs")
const shell = require("shelljs")

// Iterate environment variables to clone / pull repos.
async function run() {
    try {
        const prefix = "REPO"
        const repoFolder = "/repos"
        const username = process.env.GITHUB_USERNAME
        const token = process.env.GITHUB_TOKEN

        // Get environment variables.
        const envRepos = Object.entries(process.env)

        // Iterate env variables to process the passed repos.
        for (let [key, address] of envRepos) {
            const arrKey = key.split("_")
            const keyPrefix = arrKey.shift()
            const name = arrKey.join("_")

            // Enrich address with username and password (if possible).
            if (username && token && address.indexOf("github.com/") > 0 && address.indexOf("@github.com") < 0) {
                address = address.replace("https://", `https://${username}:${token}@`)
            }

            // Environment variable starts with REPO? Clone or pull it!
            if (keyPrefix == prefix) {
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
                    console.error(`Repo ${name}`, ex.message)
                }
            }
        }
    } catch (ex) {
        console.error(ex)
    }
}

// Run, baby, run!
run()
