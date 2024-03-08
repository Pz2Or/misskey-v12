const execa = require('execa');

(async () => {
	console.log('building packages/backend ...');

	await execa('pnpm', ['run', 'build'], {
		cwd: __dirname + '/../packages/backend',
		stdout: process.stdout,
		stderr: process.stderr,
	});

	console.log('building packages/client ...');

	await execa('pnpm', ['run', 'build'], {
		cwd: __dirname + '/../packages/client',
		stdout: process.stdout,
		stderr: process.stderr,
	});

	console.log('building packages/sw ...');

	await execa('pnpm', ['run', 'build'], {
		cwd: __dirname + '/../packages/sw',
		stdout: process.stdout,
		stderr: process.stderr,
	});

	console.log('build finishing ...');

	await execa('pnpm', ['run', 'gulp'], {
		cwd: __dirname + '/../',
		stdout: process.stdout,
		stderr: process.stderr,
	});
})();
