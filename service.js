// DOM Elementlarini olish
const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const dayColumn = document.getElementById('day-column');
const monthColumn = document.getElementById('month-column');
const yearColumn = document.getElementById('year-column');

// Bugungi sana ma'lumotlari
const today = new Date();
const todayDay = String(today.getDate()).padStart(2, '0');
const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
const todayYear = today.getFullYear();

// Tanlangan sana
let selectedDay = todayDay;
let selectedMonth = todayMonth;
let selectedYear = todayYear;

let activeButton = null;

// Tanlangan sanani yangilash funksiyasi
function updateSelectedDate() {
    return `${selectedYear}-${selectedMonth}-${selectedDay}`;
}

// Silliq skroll funksiyasi
function smoothScrollTo(column, targetValue) {
    const targetItem = Array.from(column.children).find(child => child.getAttribute('data-value') === targetValue);
    if (targetItem) {
        const pickerHeight = column.clientHeight; // Konteyner balandligi
        const itemHeight = targetItem.offsetHeight; // Har bir element balandligi
        const offsetTop = targetItem.offsetTop; // Tanlangan element joylashuvi
        const scrollPosition = offsetTop - pickerHeight / 2 + itemHeight / 2; // Markazga tushirish hisoblash

        // Scrollni amalga oshirish
        column.scrollTop = scrollPosition;

        // Vibra qo'shish
        if (navigator.vibrate) {
            navigator.vibrate(100); // 100ms davomida tebranish
        }
    }
}

// Ustunlarga click hodisasi qo'shish
function addClickListener(column, type) {
    column.addEventListener('click', (event) => {
        if (event.target.classList.contains('item')) {
            const value = event.target.getAttribute('data-value');
            if (type === 'day') selectedDay = value;
            if (type === 'month') selectedMonth = value;
            if (type === 'year') selectedYear = value;

            if (activeButton) {
                activeButton.textContent = updateSelectedDate();
            }

            Array.from(column.children).forEach(item => item.classList.remove('active'));
            event.target.classList.add('active');
        }
    });
}

// Faol tugmani o'rnatish
function setActiveButton(button) {
    btn1.classList.remove('active');
    btn2.classList.remove('active');

    button.classList.add('active');
    activeButton = button;
}

// Skroll qilish va markazlash uchun detektor
function detectMiddlePosition(column, type) {
    column.addEventListener('scroll', () => {
        const middlePosition = 75; // Yarim balandlik (150px)
        const items = Array.from(column.children);
        items.forEach(item => {
            const itemTop = item.getBoundingClientRect().top - column.getBoundingClientRect().top;
            const itemHeight = item.offsetHeight;
            const itemMiddle = itemTop + itemHeight / 2;

            if (itemMiddle >= middlePosition && itemMiddle <= middlePosition + itemHeight) {
                const value = item.getAttribute('data-value');
                if (type === 'day') selectedDay = value;
                if (type === 'month') selectedMonth = value;
                if (type === 'year') selectedYear = value;

                if (activeButton) {
                    activeButton.textContent = updateSelectedDate();
                }

                items.forEach(item => item.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });
}

// Hodisalarni qo'shish
addClickListener(dayColumn, 'day');
addClickListener(monthColumn, 'month');
addClickListener(yearColumn, 'year');

btn1.addEventListener('click', () => setActiveButton(btn1));
btn2.addEventListener('click', () => setActiveButton(btn2));
// Sahifa yuklanganda btn1 tugmasini default bosilgan qilib o'rnatish
window.addEventListener('DOMContentLoaded', () => {
    setActiveButton(btn1, updateSelectedDate());
});


// Bugungi sanani markazga tushirish
smoothScrollTo(dayColumn, todayDay);
smoothScrollTo(monthColumn, todayMonth);
smoothScrollTo(yearColumn, String(todayYear));

// "Bugungi oyni markazga tushirish" funksiyasi
const todayElementMonth = monthColumn.querySelector(`[data-value='${todayMonth}']`);
if (todayElementMonth) {
    smoothScrollTo(monthColumn, todayMonth);
}

// "Bugungi kunga skroll qilish" funksiyasi
const todayElementDay = dayColumn.querySelector(`[data-value='${todayDay}']`);
if (todayElementDay) {
    smoothScrollTo(dayColumn, todayDay);
}

// Har bir ustunni o'qish uchun detektor qo'shish
detectMiddlePosition(dayColumn, 'day');
detectMiddlePosition(monthColumn, 'month');
detectMiddlePosition(yearColumn, 'year');


// Modalni yopish
document.querySelector('.order-select__label').addEventListener('click', function () {
    const listWrapper = document.querySelector('.order-select__list-wrapper');
    listWrapper.classList.toggle('active');
    this.classList.toggle('active'); // SVG animatsiyasi uchun
});
document.addEventListener('DOMContentLoaded', function () {
    const defaultOption = document.querySelector('.order-select__option[data-value="all"]');
    const valueDisplay = document.getElementById('order-select__value');
    const listWrapper = document.querySelector('.order-select__list-wrapper');

    // Dastlab "ВСЕ" qiymatini o'rnatish
    if (defaultOption) {
        valueDisplay.textContent = defaultOption.textContent.trim();
        sendDataToServer(defaultOption.dataset.value); // Default qiymatni serverga yuborish
    }

    // Spanlar uchun hodisalarni o'rnatish
    const options = document.querySelectorAll('.order-select__option');
    options.forEach(option => {
        option.addEventListener('click', function () {
            const selectedValue = this.dataset.value;
            const selectedText = this.textContent.trim();

            // Tanlangan qiymatni ekranga o'rnatish
            valueDisplay.textContent = selectedText;

            // Tanlangan qiymatni serverga yuborish
            sendDataToServer(selectedValue);

            // Modalni yopish
            if (listWrapper.classList.contains('active')) {
                listWrapper.classList.remove('active');
            }
        });
    });

    // Serverga ma'lumot yuborish funksiyasi
    function sendDataToServer(value) {
        fetch('/your-server-endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedValue: value }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Serverdan javob:', data);
            })
            .catch(error => {
                console.error('Xatolik yuz berdi:', error);
            });
    }
});
