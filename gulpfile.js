let project_folder = "dist";
let source_folder = "src";
let fs = require('fs');


let path = {
    build: {
        html: project_folder + '/',
        css: project_folder + '/css/',
        js: project_folder + '/js/',
        img: project_folder + '/img/',
        fonts: project_folder + '/fonts/',
    },
    src: {
        html: source_folder + '/views/pages/*.html',
        css: source_folder + '/scss/main.scss',
        js: source_folder + '/js/**/*.js',
        img: source_folder + '/img/**/*',
        icons: source_folder + '/icons/**/*.svg',
        fonts: source_folder + '/fonts/*.ttf'
    },
    watch: {
        html: source_folder + '/views/{layouts,partials,helpers,data,pages}/**/*',
        css: source_folder + '/scss/**/*',
        icons: source_folder + '/icons/**/*.svg',
        js: source_folder + '/js/**/*.js',
        libs: source_folder + '/js/libs/**/*.js',
        img: source_folder + '/img/**/*',
        fonts: source_folder + '/fonts/*.ttf'
    },
    clean: '/' + project_folder + '/'
};

let { src, dest } = require('gulp');

let gulp = require('gulp'),
    panini    = require('panini'),
    browsersync = require('browser-sync').create(),
    plumber = require("gulp-plumber");
    del = require('del'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    groupmedia = require('gulp-group-css-media-queries'),
    cleancss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    webphtml = require('gulp-webp-html'),
    webpcss = require('gulp-webpcss'),
    svgSprite = require('gulp-svg-sprite'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    uglify = require('gulp-uglify'),
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2'),
    imageminSvgo = require('imagemin-svgo'),
    bourbon  = require('node-bourbon'),
    notify = require('gulp-notify'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    babelify = require("babelify"),
    buffer = require("vinyl-buffer");




/* Tasks
=========================*/

browserSync = () => {
    browsersync.init({
        server: {
            baseDir: "./dist/"
        },
        port: 3000
    });
};

browserSyncReload = () => {
    browsersync.reload();
};

html = () => {
    panini.refresh();
    return src(path.src.html, { base: 'src/views/pages/' })
        .pipe(plumber())
        .pipe(panini({
            root: 'src/',
            layouts: 'src/views/layouts/',
            partials: 'src/views/partials/',
            helpers: 'src/views/helpers/',
            data: 'src/views/data/'
        }))
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
};


js = () => {
    return (
        browserify({
            entries: [`./src/js/index.js`],
            transform: [babelify.configure({ presets: ["@babel/preset-env"] })]
        })
            .bundle()
            .pipe(source("main.js"))
            .pipe(buffer())
            //.pipe(uglify())
            .pipe(gulp.dest(`./dist/js/`))
            .pipe(browsersync.stream())
    );
};



// Конкатенация js
libs = () => {
    return gulp.src([
        './src/js/libs/jquery.min.js',
        './src/js/libs/**/!(jquery.min.js)*.js'
    ])
        .pipe(concat('libs.js'))
        .pipe(uglify())
        .pipe(rename('libs.min.js'))
        .pipe(gulp.dest(path.build.js))
        .pipe(browsersync.stream())
};


//Сборка scss
css = () => {
    return src(path.src.css)
        .pipe(scss({
            includePaths: bourbon.includePaths
        }).on("error", notify.onError()))
        // .pipe(
        //     groupmedia()
        // )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 version"],
                cascade: true
            })
        )
        //.pipe(webpcss())
        //.pipe(cleancss())
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());
};

//Шрифты
fonts = () => {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));

    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts));
};



//Сборка img
images = () => {
    return src(path.src.img)
        .pipe(
            webp({
                quality: 75
            })
        )
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimizationLevel: 3
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
};


//Спрайты
svg = () => {
     src(path.src.icons)
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        // remove all fill, style and stroke declarations in out shapes
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: { xmlMode: true }
        }))
        // cheerio plugin create unnecessary string '&gt;', so replace it.
        .pipe(replace('&gt;', '>'))
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "../img/sprite.svg",
                    example: true
                }
            }
        }))
        .pipe(gulp.dest(project_folder));

    return gulp.src(path.src.icons)
        .pipe(imagemin([
            imageminSvgo({
                plugins: [
                    {removeViewBox: true}
                ]
            })
        ]))
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../img/icons.svg",
                    example: true
                }
            }
        }))
        .pipe(gulp.dest(project_folder))
        .pipe(browsersync.stream())
};




//Запуск сервера
browserSync = (done) => {
    browsersync.init({
        server: {
            baseDir: './' + project_folder + '/'
        },
        port: 3000,
        notify: false
    });
};

//Очистка папки
clean = () => {
    return del(path.clean);
};


fontsStyle = (params) => {
    let file_content = fs.readFileSync(source_folder + '/scss/utils/fonts.scss');
    if (file_content == '') {
        fs.writeFile(source_folder + '/scss/utils/fonts.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile(source_folder + '/scss/utils/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        })
    }
};

cb = () => {

};





watchFiles = () => {
    gulp.watch([path.watch.css], {usePolling: true} , css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
    gulp.watch([path.watch.icons], svg);
    gulp.watch([path.watch.fonts], fonts);
    gulp.watch([path.watch.libs], libs);
    gulp.watch([path.watch.html], html);
};



let build = gulp.series(clean, gulp.parallel(css, js, images, svg, fonts, libs, html), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);



exports.html = html;
exports.libs = libs;
exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.svg = svg;
exports.images = images;
exports.js = js;
exports.css = css;
exports.build = build;
exports.watch = watch;
exports.default = watch;