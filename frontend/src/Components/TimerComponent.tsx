import React, { useState, useEffect } from 'react';

interface TimerComponentProps {
    number: string;
    correct: boolean | null;
}

const TimerComponent: React.FC<TimerComponentProps> = ({ correct, number }) => {
    const [seconds, setSeconds] = useState<number>(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        // Запускаем таймер, если correct не true
        if (correct === null || !correct) {
            interval = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds + 1);
            }, 1000); // Увеличиваем счетчик каждую секунду
        }

        // Очищаем интервал при размонтировании или изменении correct
        return () => {
            clearInterval(interval);
        };
    }, [correct]); // Добавляем correct в зависимости
    useEffect(() => {
        // Если correct становится true, сохраняем значение seconds в localStorage
        if (correct === true) {
            localStorage.setItem(number, seconds.toString());
        }
    }, [correct, seconds, number]);
    return null;
};

export default TimerComponent;
