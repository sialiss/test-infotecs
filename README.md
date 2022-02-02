# test-infotecs

Это моё тестовое задание для отбора на стажировку в Infotecs, JS разработчик
В коде есть комментарии и JSDoc, тут я объясняю некоторые решения, возникшие в ходе выполнения

#### центрирование
таблица расположена по центру, чтобы выглядело приятнее, занимают она 50% ширины экрана, если надо, то центрирование легко убрать.

#### необходимость сервера
во-первых, это нужно для работы импортов,
во-вторых, для того, чтобы извлечь массив объектов из JSON файла, я использую fetch, для работы этой функции также нужен сервер (node.js). Здесь у меня был выбор между тем, чтобы просто скопировать весь JSON и сделать его переменной JS, но мне кажется, что это не очень хорошее решение в данном случае, поэтому я остановилась на использовании fetch.

#### почему ООП и класс Table
в основном, класс нужен для того, чтобы определить общие переменные, и не передавать их по всему скрипту, создавая лишнюю нагрузку
изначально я делала всё функционально, но в итоге вышло, что элемент таблицы нужно передавать всё дальше и дальше, хотя используется он не везде. Сделать его глобальной переменной я не могла, так как это нарушило бы инкапсуляцию (скрипт нельзя было бы использовать для другой таблицы) и лишило меня возможности свободно выносить функции в отдельные файлы.

#### совместимость (про about)
в клетках колонки "Описание" отображаются только первые две строчки, это реализовано с помощью -webkit-line-clamp: 2, это не работает в IE, OperaMini и KaiOS Browser, для полной поддержки можно реализовать через JS.

#### послесловие
сегодня я доделала это, и это определённо был полезный опыт, иии я очень хотела бы, чтобы меня взяли, потому что очень хочу развиваться дальше и работать, мне очень нравится, уххх, well, I did my best, полагаю, больше я повлиять никак не могу, очень волнительно отправлять на проверку, и я сильно переживаю, что не пройду из-за того, что у меня мало опыта, или рамок возраста/курса, но в любом случае это будет ещё одним моим шагом на пути к цели, спасибо, что предоставили такую возможность и, вероятно, прочитали этот поток мыслей, я очень рада.
(и ещё у Вашей компании крутой сайт, мне очень нравится, как сделаны переходы при переключении основных новостей на главной странице, это очень красиво)