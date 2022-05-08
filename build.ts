import fs, { CopyOptions } from 'fs-extra'
import logger from 'morgan'
import childProcess from 'child_process'
;(async () => {
  try {
    await remove('./built')
    await copy('./src/views', './built/views', {
      overwrite: true,
      recursive: true,
    })
    await copy('./src/public', './built/public', {
      overwrite: true,
      recursive: true,
    })
    await exec('tsc -b')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger(error.message)
    console.log(error.message)
  }
})()

function remove(path: string) {
  return new Promise<void>((resolve, reject) => {
    return fs.remove(path, (err: Error) => {
      return !err ? resolve() : reject(err)
    })
  })
}

function copy(src: string, dest: string, opt: CopyOptions) {
  return fs.copy(src, dest, opt)
}

function exec(cmd: string) {
  return new Promise<void>((resolve, reject) => {
    childProcess.exec(cmd, { cwd: './' }, (err, stdout, stderr) => {
      if (stdout) logger(`stdout: ${stdout}`)
      if (stderr) logger(`stdout: ${stderr}`)
      if (err) logger(`err: ${err.message}`)

      return err ? reject(err) : resolve()
    })
  })
}
