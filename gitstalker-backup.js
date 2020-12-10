// GITSTALKER: GITHUB BACKUP

const bent = require("bent")
const fs = require("fs")

// Backup repos for the provided username.
async function run() {
    try {
        const backupFolder = "/backup"
        const username = process.env.GITHUB_USERNAME
        const token = process.env.GITHUB_TOKEN

        // Check for username, token and backup mount.
        if (!fs.existsSync(backupFolder)) return console.warn(`Folder ${backupFolder} not mounted`)
        if (username && !token) return console.warn("GitHub username is set, but GITHUB_TOKEN is missing")
        if (!username && token) return console.warn("GitHub token is set, but GITHUB_USERNAME is missing")

        // Backup days options.
        const days = parseInt(process.env.BACKUP_DAYS) || 7
        const daysMs = days * 86400 * 1000

        // Get days and timestamp YYYY-MM-DD.
        const now = new Date()
        const arrNow = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
        for (let i = 0; i < arrNow.length; i++) {
            arrNow[i] = arrNow[i] < 10 ? `0${arrNow[i]}` : arrNow[i].toString()
        }
        const timestamp = arrNow.join("-")

        // Default auth headers.
        const headers = {}
        headers["Authorization"] = `token ${token}`
        headers["User-Agent"] = process.env.USER_AGENT || "GitStalker"

        // Fetch list of user repos from GitHub.
        const getUserRepos = bent(`https://api.github.com/user/repos`, "GET", "json", headers)
        const repos = await getUserRepos()

        // Iterate user repos and try download each one of them.
        for (let repo of repos) {
            try {
                if (!repo.archive_url) {
                    console.log(`Repo ${repo.full_name} has no archive URL`)
                    continue
                }

                let data = null

                // Redirection count and default download URL.
                let count = 0
                let downloadUrl = repo.archive_url.replace("{archive_format}", "zipball/").replace("{/ref}", repo.default_branch)

                // Helper to follow downloads locations.
                const download = async () => {
                    count++

                    const follow = bent(downloadUrl, "GET", 200, 302, headers)
                    const res = await follow()

                    if (res.status == 302 && res.headers && res.headers.location) {
                        downloadUrl = res.headers.location
                    } else {
                        data = await res.arrayBuffer()
                    }
                }

                // Keep following redirections up to the actual download location.
                while (!data && count < 5) {
                    await download()
                }

                // Archive data downloaded?
                if (data) {
                    const filename = repo.full_name.replace("/", "-")
                    console.log(`Downloading ${repo.full_name}`)
                    fs.writeFileSync(`${backupFolder}/${filename}.${timestamp}.zip`, data)
                } else {
                    console.warn(`No valid archive found for ${repo.full_name}`)
                }
            } catch (ex) {
                console.error(`Repo ${repo.full_name}`, ex.message)
            }
        }

        // Cleanup older backups.
        const files = fs.readdirSync(backupFolder)

        for (let file of files) {
            const arrFilename = file.split(".")
            const fileTimestamp = arrFilename[arrFilename.length - 2]
            const fileDate = new Date(`${fileTimestamp} 00:00:00`)

            if (fileDate.valueOf() + daysMs <= now) {
                console.log(`Deleting ${file}`)
                fs.unlinkSync(`${backupFolder}/${file}`)
            }
        }
    } catch (ex) {
        console.error(ex)
    }
}

// Run, baby, run!
run()
