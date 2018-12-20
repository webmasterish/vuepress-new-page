'use strict';

const PATH	= require('path');
const FSE   = require('fs-extra');

// -----------------------------------------------------------------------------

import test		from 'ava';
import execa	from 'execa';

// -----------------------------------------------------------------------------

const TEST = {
	cli_file		: './cli.js',
	directory		: PATH.join('__', 'tests', 'create'),
	filename		: 'index.md',
	title				: () => `Randomness ${Math.random().toString(36).slice(2)}`,
	create_args	: [],
};

// -----------------------------------------------------------------------------

/**
 * Test title provided
 *
 * This test should run before 'exists', hence using `test.serial`,
 * so that we use the same created data
 */
test.serial('title provided', async t => {
	
	TEST.create_args	= [
		`--title=${TEST.title()}`,
		`--directory=${TEST.directory}`,
		`--filename=${TEST.filename}`,
	];

	// ---------------------------------------------------------------------------
	
	const ret = await execa( TEST.cli_file, TEST.create_args );

	// ---------------------------------------------------------------------------

	t.is( ret.code, 0 );

	// ---------------------------------------------------------------------------

	t.regex( ret.stdout, /successfuly created/ );

});



/**
 * Test title required
 */
test('title required', async t => {

	const ret = await t.throwsAsync( execa( TEST.cli_file ) );

	// ---------------------------------------------------------------------------

	t.is( ret.code, 1 );

	// ---------------------------------------------------------------------------

	t.regex( ret.stderr, /title required/ );

});



/**
 * Test exists
 */
test('exists', async t => {
	
	const ret = await t.throwsAsync( execa( TEST.cli_file, TEST.create_args ) );

	// ---------------------------------------------------------------------------

	t.is( ret.code, 1 );

	// ---------------------------------------------------------------------------

	t.regex( ret.stderr, /already exists/ );

});



/**
 * Cleanup by emptying test dir
 */
test.after.always('cleanup', async t => await FSE.emptyDir( TEST.directory ) );
