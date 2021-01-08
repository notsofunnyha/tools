async function cleanUselessFile(path, retains) {
  for await (const dirEntry of Deno.readDir(path)) {
    if (!retains.includes(dirEntry.name)) {
      await Deno.remove(path + dirEntry.name, { recursive: true })
      console.log('remove:', dirEntry.name)
    }
  }
}

async function copyBindingsNode() {
  await Deno.copyFile(
    './output/app-win32-x64/resources/app/build/bindings.node',
    './output/app-win32-x64/resources/app/node_modules/@serialport/bindings/build/Release/bindings.node',
  )
}

async function clean() {
  await copyBindingsNode()

  await cleanUselessFile('./output/app-win32-x64/resources/app/', [
    'build',
    'node_modules',
    'index.html',
    'index.prod.js',
    'index.prod.js.map',
    'main.js',
    'package.json',
    'preload.js',
    'renderer.js',
  ])

  await cleanUselessFile('./output/app-win32-x64/resources/app/node_modules/', [
    '@serialport',
    'bindings',
    'debug',
    'file-uri-to-path',
    'ms',
    'serialport',
  ])

  console.log('ok')
}

clean()
