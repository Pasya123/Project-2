let gulp = require('gulp'), // обьявляем переменную самого Gulp
    sass = require('gulp-sass'), // обьявляем переменные для плагина Gulp, звязываем его через require
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    gulpStylelint = require('gulp-stylelint');


gulp.task('sass', function(){
    return gulp.src('app/scss/**/*.scss') 
        .pipe(sass({outputStyle: 'compressed'})) // expanded меняет стиль sass (при вложенности и т.п.) на классический стиль цсс (можно изменить на compressed и раскомментировать строку ниже, тогда файл сожмётся и переименуется)
        .pipe(rename({suffix: '.min'}))
        .pipe(autoprefixer()) // после компиляции sass кода - вызываем autoprefixer для расставления префиксов
        .pipe(gulp.dest('app/css')) // указываем куда перемещать компилированные в .css файлы
        .pipe(browserSync.reload({stream: true})) // обновляет локальный сервер при выполнении таска
});

//gulp.task('lintCss', function(){
//    return gulp
 //       .src('app/scss/**/*.scss')
 //       .pipe(gulpStylelint
 //           ({reporters: [{formatter: 'string', console: true}]
 //       }));
//}

gulp.task('autoprefixer', function(){
    return gulp.src('app/css/**/*.css')
        .pipe(autoprefixer({
			overrideBrowserslist: ['last 5 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('app/css'))
});

gulp.task('html', function(){ // обновляет локальный сервер при выполнении таска
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({stream: true})) 
});

gulp.task('script', function(){ // обновляет локальный сервер при выполнении таска
    return gulp.src('app/js/*.js')
        .pipe(browserSync.reload({stream: true})) 
});

gulp.task('js', function(){
    return gulp.src([ // квадратные скобки, чтобы прописать несколько адресов, откуда мы будем брать js файлы для конкатинации
        'app/js/**/*.js', // тут в скобках прописываем адрес к файлам и так каждый раз с новой строчки, через запятую.
    //  ''
    ])
        .pipe(concat('libs.min.js')) // обьединяем все файлы через concat в файл с указанным именем
        .pipe(uglify()) // сжимаем обьединённый файл через uglify
        .pipe(gulp.dest('app/js')) // выбрасываем готовый файл в указанную папку
        .pipe(browserSync.reload({stream: true})) // обновляет локальный сервер при выполнении таска (таск выше выполняется командой 'gulp js)
});

gulp.task('browser-sync', function(){
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
});

gulp.task('watch', function(){
    gulp.watch('app/scss/**/*.scss', gulp.parallel('sass')) // функция: мониторить указанную папку галпу и при изменении указанных файлов тут же запускается таск 'gulp sass'
    gulp.watch('app/*.html', gulp.parallel('html')) // task по отслеживанию изменений в html и обновлении локального сервера при изменениях в них через запуск таска 'html'
    gulp.watch('app/js/*.js', gulp.parallel('script')) // task по отслеживанию изменений в js и обновлении локального сервера при изменениях в них через запуск таска 'script'
});

gulp.task('default', gulp.parallel('sass', 'autoprefixer', 'js', 'browser-sync', 'watch')) // стандартный таск (вызывающийся командой 'gulp'), выполняющий таски: sass, js, browser-sync, watch, autoprefixer

//gulp.task('lintCss', gulp.parallel('lintCss'))
//exports.lintCss = lintCss;