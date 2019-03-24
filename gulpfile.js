const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const pug = require('pug');
const del = require('del');
const browserSync = require('browser-sync');

const unified = require('unified');
const parse = require('remark-parse');
const mark2hype = require('remark-rehype');
const frontmatter = require('remark-frontmatter');
const format = require('rehype-format');
const stringify = require('rehype-stringify');
const footnote = require('dewriteful/lib/packages/remark-footnote-in-place');
const ruby = require('dewriteful/lib/packages/remark-ruby');
const slugger = require('dewriteful/lib/packages/remark-dewriteful-slugger');
const footnoteHandler = require('./mdast2hast-handlers/footnote');
const rubyHandler = require('dewriteful/lib/mdast2hast-handlers/ruby');
const latexPlugins = require('@paperist/remark-latex');
const crossref = require('@paperist/remark-crossref');
const crossReferenceHandler = require('./mdast2hast-handlers/crossReference');
const highlight = require('./highlight');

const mdProcessor = unified()
  .use(parse, latexPlugins.settings)
  .use(frontmatter, ['yaml', 'toml'])
  .use(highlight)
  // .use(config)
  .use(slugger)
  // .use(footnote)
  .use(ruby)
  .use(crossref)
  // .use(latexPlugins.plugins.MathPlugin)
  // .use(latexPlugins.plugins.TableCaptionPlugin)
  .use(mark2hype, {
    handlers: {
      footnote: footnoteHandler,
      ruby: rubyHandler,
      crossReference: crossReferenceHandler,
    },
  })
  .use(format)
  .use(stringify)
  .freeze();

pug.filters.marked = (str, options) => {
  const converted = mdProcessor.processSync(str);
  const html = String(converted);
  return html;
};

const $ = gulpLoadPlugins();
const plumberOpt = {
  errorHandler: function(err) {
    console.error(err.stack);
    this.emit('end');
  },
};

gulp.task('default', ['pug', 'assets', 'stylus']);

gulp.task('projectdoc', ['pug:project', 'assets', 'stylus:project']);

gulp.task('pug', () => {
  gulp
    .src('content/**/[!_]*.pug')
    .pipe($.plumber(plumberOpt))
    .pipe(
      $.pug({
        pug: pug,
        pretty: true,
      })
    )
    .pipe(gulp.dest('dest/'));
});

gulp.task('assets', ['assets:delete'], () =>
  gulp.src('content/assets/**/*').pipe(gulp.dest('dest/assets/'))
);

gulp.task('assets:delete', del.bind(null, ['dest/assets/**/*']));

gulp.task('stylus', () => {
  gulp
    .src('style/main.styl')
    .pipe($.plumber(plumberOpt))
    .pipe($.sourcemaps.init())
    .pipe(
      $.stylus({
        'include css': true,
      })
    )
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('dest/'))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

gulp.task('browsersync', () => {
  browserSync({
    server: {
      baseDir: 'dest/',
      index: 'index.html',
    },
  });
});

gulp.task('bs-reload', () => {
  browserSync.reload();
});

gulp.task('watch', ['default', 'browsersync'], () => {
  gulp.watch('content/**/*.pug', ['pug']);
  gulp.watch('content/assets/**/*', ['assets']);
  gulp.watch('style/**/*.styl', ['stylus']);
  gulp.watch('dest/*.html', ['bs-reload']);
});

gulp.task('watch:stylus', ['stylus'], () => {
  gulp.watch('style/**/*.styl', ['stylus']);
});
