#! /usr/bin/env node

// -----------------------------------------------------------------------------

const { name, version, description } = require('./package.json');

// -----------------------------------------------------------------------------

const FSE        = require('fs-extra');
const PATH       = require('path');
const COMMANDER  = require('commander');
const RC         = require('rc');
const DATEFORMAT = require('dateformat');
const SLUGIFY    = require('slugify');

// -----------------------------------------------------------------------------

/**
 * settings values
 */
const SETTINGS = {
	config	: {}, // config values extracted from defaults set in rc files
	options	: {},
};

/**
 * holds all relevant functions
 */
const CLI = {};

// -----------------------------------------------------------------------------

/**
 * Used for getting the config and setting it once
 * 
 * @return {object}
 */
CLI.config = () =>
{
	
	if ( Object.keys( SETTINGS.config ).length === 0 )
	{
		const template = [
			'---',
			'',
			'title: %%title%%',
			'',
			'date: %%date%%',
			'',
			'---',
			'',
			'# {{ $page.title }}',
			'',
		];
			
		// -------------------------------------------------------------------------
		
		const defaults = {
			directory		: 'docs',
			filename		: 'README.md',
			dateformat	: 'isoDateTime',
			template,
		};
		
		SETTINGS.config = RC( name, defaults );
	}
		
	// ---------------------------------------------------------------------------
	
	return SETTINGS.config;
	
};
// CLI.config()



/**
 * Used for getting availble options and setting them once
 * 
 * @return {object}
 */
CLI.options = () =>
{
	
	if ( Object.keys( SETTINGS.options ).length > 0 )
	{
		return SETTINGS.options;
	}
		
	// ---------------------------------------------------------------------------
	
	const config = CLI.config();
		
	// ---------------------------------------------------------------------------
	
	const options = [
		{ name: 'title', required: true },
		{ name: 'slug' },
		{ name: 'date' },
		{ name: 'dateformat', short: 'f' },
		{ name: 'directory', short: 'D' },
		{ name: 'filename', short: 'F' },
		{ name: 'template', nopt: true },
	];
		
	// ---------------------------------------------------------------------------
	
	SETTINGS.options = options.map( e => {
		
		if ( e.name )
		{
			// has to be set before e.nopt check so 'e' would include it
			
			e.default = e.default || config[ e.name ] || '';
			
			// -----------------------------------------------------------------------
			
			// nopt would not be added as arg to commander
			
			if ( e.nopt )
			{
				return e;
			}
			
			// -----------------------------------------------------------------------
			
			e.short				= e.short || e.name.charAt( 0 );
			e.description	= e.description || `Page/Post ${e.name}`;
			
			// -----------------------------------------------------------------------
			
			const optional_or_required = e.required ? `<${e.name}>` : '[optional]';
			
			e.commander = [
				`-${e.short}, --${e.name} ${optional_or_required}`,
				( e.default ) ? `${e.description} - defaults to '${e.default}'` : e.description
			];
			
			// -----------------------------------------------------------------------
			
			return e;
		}
		
	})
	.filter( e => e );
		
	// ---------------------------------------------------------------------------
	
	return SETTINGS.options;
	
};
// CLI.options()



/**
 * Setup commander
 */
CLI.setup = () =>
{

	COMMANDER
		.version( version, '-v, --version')
		.description(`${name} version ${version}\n${description}`);
	
	// ---------------------------------------------------------------------------
	
	for ( const option of CLI.options() )
	{
		if ( ! option.nopt )
		{
			COMMANDER.option( ...option.commander );
		}
	}
	
	// ---------------------------------------------------------------------------

	COMMANDER.parse( process.argv );
	
};
// CLI.setup()



/**
 * Creates a new vuepress content file based on args
 * 
 * @return {string}
 */
CLI.create = async () =>
{
	
	try {
		
		CLI.setup();
		
		// -------------------------------------------------------------------------
	
		if ( ! COMMANDER.title )
		{
			throw new Error('title required');
		}
		
		// -------------------------------------------------------------------------
		
		const args = {};
		
		for ( const option of CLI.options() )
		{
			args[ option.name ] = COMMANDER[ option.name ] ? COMMANDER[ option.name ] : option.default;
		}
		
		args.date = args.date ? args.date : DATEFORMAT( args.dateformat );
		args.slug = args.slug ? args.slug : SLUGIFY( args.title, { lower: true } );
		
		// -------------------------------------------------------------------------
		
		const file		= PATH.join( ...[ args.directory, args.slug, args.filename ].filter( e => e ) );
		const exists	= await FSE.pathExists( file );
		
		if ( exists )
		{
			throw new Error(`already exists: '${file}'`);
		}
		
		// -------------------------------------------------------------------------
		
		let template = args.template || '';
		
		if ( template )
		{
			if ( Array.isArray( template ) )
			{
				template = template.join("\n");
			}
		
			// -----------------------------------------------------------------------
			
			template = template
									.replace(/%%title%%/gmi, args.title)
									.replace(/%%date%%/gmi, args.date);
		}
		
		await FSE.outputFileSync( file, template );
		
		console.log(`successfuly created: '${file}'`);
		
		// -------------------------------------------------------------------------
		
		return file;
		
	} catch ( err ) {
		
		console.error( err.message );
		
		process.exit( 1 );
		
	}
	
};
// CLI.create()

// -----------------------------------------------------------------------------

(async () => {
	
	const file = await CLI.create();
		
	// ---------------------------------------------------------------------------
	
	process.exit( 0 );
	
})();
