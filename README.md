# VuePress New Page

> A simple way to create a new [VuePress](https://vuepress.vuejs.org/) page or post

[![Build Status](https://img.shields.io/travis/webmasterish/vuepress-new-page/master.svg?style=flat-square)](https://travis-ci.org/webmasterish/vuepress-new-page)
[![Coverage Status](https://img.shields.io/coveralls/github/webmasterish/vuepress-new-page/master.svg?style=flat-square)](https://coveralls.io/github/webmasterish/vuepress-new-page?branch=master)
[![npm version](https://img.shields.io/npm/v/vuepress-new-page.svg?style=flat-square)](http://npm.im/vuepress-new-page)
[![MIT License](https://img.shields.io/npm/l/express.svg?style=flat-square)](http://opensource.org/licenses/MIT)


## Why

I'm lazy, get bored easily, and make a lot of mistakes.


## What

It would create the directory and file with initial [front matter](https://vuepress.vuejs.org/guide/frontmatter.html)
such as `title` and current `date`.


## Install


```sh
$ npm install --global vuepress-new-page
```


## Usage

```sh
$ vuepress-new-page --help

  Usage: cli [options]

  vuepress-new-page version 0.1.0
  A simple way to create a new VuePress page or post

  Options:
    -v, --version                output the version number
    -t, --title <title>          Page/Post title - required
    -s, --slug [optional]        Page/Post slug
    -d, --date [optional]        Page/Post date
    -f, --dateformat [optional]  Page/Post dateformat - defaults to 'isoDateTime'
    -D, --directory [optional]   Page/Post directory - defaults to 'docs'
    -F, --filename [optional]    Page/Post filename - defaults to 'README.md'
    -h, --help                   output usage information


  Examples:
    $ vuepress-new-page --title="My Post Title"
    
    # or you can use the shorter alias `vp-new`
    $ vp-new --title="My Page Title" --directory="some/sub/dir"

```


## Examples


### Basic

```sh
$ vp-new --title="My Page Title"
```

Would create `docs/my-page-title/README.md` having the following content:


```
---

title: My Page Title

date: 2018-12-20T04:42:59+0200

---

# {{ $page.title }}

```


### Custom options using command args


```sh
$ vp-new \
  --title="My Blog Post Title" \
  --directory="source/blog" \
  --filename="index.md" \
  --dateformat="yyyy-mm-dd HH:MM:ss"
```

Would create `source/blog/my-blog-post-title/index.md` having the following content:


```
---

title: My Blog Post Title

date: 2018-12-20 04:55:20

---

# {{ $page.title }}

```



### Using rc file(s)

You can simply create an rc file `.vuepress-new-pagerc` 
and place it in your project directory.

Here's an example:

```
{
  "directory": "projects/node/cli",
  "filename": "index.md",
  "dateformat": "default",
  //
  // here's how you can set your own template as an array
  // the array is simply joined with "\n"
  //
  "template": [
    "---",
    "",
    "title: %%title%%",
    "",
    "date: %%date%%",
    "",
    "author: [Webmasterish](https://webmasterish.com)",
    "",
    "description: A simple way to create a new VuePress page or post",
    "",
    "meta:",
    "  - name: twitter:title",
    "    content: %%title%%",
    "  - name: twitter:description",
    "    content: A simple way to create a new VuePress page or post",
    "  - name: twitter:url",
    "    content: {{ $site.url }}{{ $page.permalink }}",
    "  - property: og:type",
    "    content: article",
    "  - property: og:title",
    "    content: %%title%%",
    "  - property: og:description",
    "    content: A simple way to create a new VuePress page or post",
    "  - property: og:url",
    "    content: {{ $site.url }}{{ $page.permalink }}",
    "",
    "---",
    "",
    "# %%title%%",
    "",
    "> on %%date%% i created %%title%%",
    ""
  ]
  //
  // and here's an example having the template set as a string
  //"template": "---\ntitle: %%title%%\n---"
  //
}

```

Assuming you have the same `rc` file as the above, and have placed at
`./.vuepress-new-pagerc`, and then used `vp-new -t "VuePress New Page - Node Cli App ✨"`,
the result would be a file created at `./projects/node/cli/vuepress-new-page-node-cli-app/index.md` 
having the following content:


```
---

title: VuePress New Page - Node Cli App ✨

date: Thu Dec 20 2018 06:05:14

author: [Webmasterish](https://webmasterish.com)

description: A simple way to create a new VuePress page or post

meta:
  - name: twitter:title
    content: VuePress New Page - Node Cli App ✨
  - name: twitter:description
    content: A simple way to create a new VuePress page or post
  - name: twitter:url
    content: {{ $site.url }}{{ $page.permalink }}
  - property: og:type
    content: article
  - property: og:title
    content: VuePress New Page - Node Cli App ✨
  - property: og:description
    content: A simple way to create a new VuePress page or post
  - property: og:url
    content: {{ $site.url }}{{ $page.permalink }}

---

# VuePress New Page - Node Cli App ✨

> on Thu Dec 20 2018 06:05:14 i created VuePress New Page - Node Cli App ✨

```


## Reference

- Command args are parsed using [commander.js](https://github.com/tj/commander.js)
- rc files are parsed using [rc package](https://github.com/dominictarr/rc)
- Dates are formated using [dateformat package](https://github.com/felixge/node-dateformat)
- Files and directories are created using [fs-extra](https://github.com/jprichardson/node-fs-extra)


## License

MIT © [webmasterish](https://webmasterish.com)
