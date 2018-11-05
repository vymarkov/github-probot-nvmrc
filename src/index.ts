import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars
import get from 'lodash.get'

const CHECK_NAME = 'nvmrc'
const NVMRC_FILE_PATH = '.nvmrc'

const nvmRcExists = async (context: Context, repository: string) => {
  const [owner, repo] = repository.split('/')
  try {
    const content = await context.github.repos.getContent({ owner, repo, path: NVMRC_FILE_PATH })
    context.log.info({ data: content.data }, `Recevived content for ${NVMRC_FILE_PATH}`)
    return true
  } catch (err) {
    context.log.error(err, `${NVMRC_FILE_PATH} not found`)
  }
  return false
}

const createCheck = async (context: Context) => {

}

export = (app: Application) => {
  app.on('integration_installation.created', async (context) => {
    context.log.info({ payload: context.payload })

    const repo = await context.github.repos.get({ repo: 'hackathon-starter', owner: 'vymarkov' })
    context.log.info({ repo })
  })
  app.on('issues.opened', async (context) => {
    const issueComment = context.issue({ body: 'Thanks for opening this issue!' })
    await context.github.issues.createComment(issueComment)
  })

  app.on('pull_request.opened', async (context) => {
    // context.log.info({ payload: context.payload })
    
    const [owner, repo] = context.payload.repository.full_name.split('/')
    // context.log.info({ owner, repo })
    const repository = await context.github.repos.get({ repo, owner })
    context.log.info({ data: repository.data }, 'Repository')

    const commits = await context.github.pullRequests.getCommits({ owner, repo, page: 1, per_page: 1, number: 1 })
    context.log.info({ commits })

    const headSha = get(commits, 'data[0].sha')
    // const check = await context.github.checks.create({ owner, repo, name: "nvmrc2", head_sha: headSha, completed_at: new Date().toISOString(), conclusion: 'success', status: 'completed' })
    // context.log.info({ check })
    
    const checks = await context.github.checks.listSuitesForRef({ owner, repo, ref: headSha, check_name: 'nvmrc' })
    // // get(checks, 'data.check_suites', [])
    context.log.info({ checks })

    // context.github.checks.update()
    // await context.github.checks.update({ check_run_id: 28720128, repo, owner, completed_at: new Date().toISOString(), conclusion: 'success', status: "completed" })
  })

  app.on('pull_request.synchronize', async (context) => {
    const [owner, repo] = context.payload.repository.full_name.split('/')
    const commits = await context.github.pullRequests.getCommits({ owner, repo, page: 1, per_page: 10, number: 1 })
    const lastCommit = commits.data.pop()
    context.log.info({ lastCommit })

    const ref = lastCommit ? lastCommit.sha : ''

    const checks = await context.github.checks.listSuitesForRef({ owner, repo, ref, check_name: CHECK_NAME })
    context.log.info({ checks })
    if (checks.data.check_suites.length === 0) {
      //
    }

    if (await nvmRcExists(context, context.payload.repository.full_name)) {
      context.log.info('.nvmrc is found, create a check with success status')
    } else {
      context.log.warn('.nvmrc not found, create a check with warning status')
    }
  })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
