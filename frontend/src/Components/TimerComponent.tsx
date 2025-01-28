import React, { useState, useEffect } from 'react';
interface TimerComponentProps {
  seconds?: number;
  correct: boolean | null;
}
const TimerComponent: React.FC<TimerComponentProps> = ({correct}) => {
    const [seconds, setSeconds] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(true); // Состояние для управления таймером

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning) {
            interval = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds + 1);
            }, 1000); // Увеличиваем счетчик каждую секунду
        }
        console.log(correct);
        if(correct){
            
            stopTimer();
        }

        return () => {
            clearInterval(interval); // Очищаем интервал при размонтировании или изменении isRunning
        };
    }, [isRunning]);

    // Функция для остановки таймера
    const stopTimer = () => {
        setIsRunning(false); // Устанавливаем isRunning в false для остановки таймера
    };

    return (
        <div>
            <h1>{seconds} </h1>
        </div>
    );
};

export default TimerComponent;
