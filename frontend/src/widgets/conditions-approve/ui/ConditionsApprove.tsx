"use client";

import Heading from "@/shared/ui/typography/Heading";
import Checkbox from "@/shared/ui/inputs/Checkbox";
import {useState} from "react";
import AccentButton from "@/shared/ui/AccentButton";

type Props = {
    onContinue: () => {}
}

export const ConditionsApprove = ({onContinue}: Props) => {
    const [isChecked, setIsChecked] = useState(false);

    return <div>
        <Heading className="mb-5 text-center" level={3}>Согласие на обмен финансовыми данными</Heading>
        <div className="text-sm mb-5 font-medium">
            Регистрируясь в сервисе «Семейный мультибанк», вы создаете общее финансовое пространство со своей второй
            половиной.
            <br/><br/>
            Нажимая <b>«Согласен»</b>, вы подтверждаете:
            <br/><br/>
            <ol className="list-decimal list-inside">
                <li>Вы предоставляете доступ к данным ваших банковских счетов, карт и кредитов.</li>
                <li>Ваша вторая половина будет видеть полную информацию по ним: балансы, историю операций, долги и
                    платежи.
                </li>
                <li>Вы получаете аналогичный доступ к финансовым данным вашего партнера.</li>
                <li>Вы можете в любой момент отозвать это согласие в настройках профиля, отключив партнера.</li>
            </ol>
            <br/>
            <span className="text-error">Важно: После отзыва согласия ваш партнер лишится доступа к новым операциям, но не к истории, которую он уже увидел.</span>
        </div>
        <div className="mb-5">
            <Checkbox value={isChecked} onChange={() => setIsChecked(!isChecked)}>
                <p className="text-sm">Да, я понимаю и соглашаюсь с этими условиями</p>
            </Checkbox>
        </div>
        <div className="mb-2 flex flex-col">
            <AccentButton disabled={!isChecked} onClick={onContinue} large background="bg-primary"
                          className="justify-center py-2.5! font-normal!">Продолжить</AccentButton>
        </div>
    </div>
}