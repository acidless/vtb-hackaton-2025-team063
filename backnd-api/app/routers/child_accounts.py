from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..dependencies import get_db
from ..models import ChildAccount, User, Bank
from ..schemas import ChildAccountCreate, ChildAccountRead, ChildAccountUpdate

router = APIRouter(prefix="/child-accounts", tags=["child-accounts"])


@router.post(
    "/",
    response_model=ChildAccountRead,
    status_code=status.HTTP_201_CREATED,
    summary="Создать детский аккаунт",
)
async def create_child_account(
    payload: ChildAccountCreate,
    db: AsyncSession = Depends(get_db),
) -> ChildAccountRead:
    # Проверка существования пользователя
    user = await db.scalar(select(User).where(User.id == payload.user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден",
        )

    # Проверка существования банка
    bank = await db.scalar(select(Bank).where(Bank.id == payload.bank_id))
    if not bank:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Банк не найден",
        )

    child_account = ChildAccount(
        user_id=payload.user_id,
        child_name=payload.child_name,
        balance=payload.balance,
        bank_id=payload.bank_id,
    )

    db.add(child_account)
    await db.commit()
    await db.refresh(child_account)

    return ChildAccountRead.model_validate(child_account)


@router.get(
    "/",
    response_model=list[ChildAccountRead],
    summary="Получить список детских аккаунтов",
)
async def list_child_accounts(
    user_id: int | None = Query(
        default=None,
        ge=1,
        description="Фильтр по идентификатору пользователя",
    ),
    bank_id: int | None = Query(
        default=None,
        ge=1,
        description="Фильтр по идентификатору банка",
    ),
    skip: int = Query(default=0, ge=0, description="Количество записей для пропуска"),
    limit: int = Query(
        default=100, ge=1, le=1000, description="Максимальное количество записей"
    ),
    db: AsyncSession = Depends(get_db),
) -> list[ChildAccountRead]:
    query = select(ChildAccount)
    if user_id is not None:
        query = query.where(ChildAccount.user_id == user_id)
    if bank_id is not None:
        query = query.where(ChildAccount.bank_id == bank_id)

    query = query.offset(skip).limit(limit).order_by(ChildAccount.created_at.desc())

    result = await db.execute(query)
    child_accounts = result.scalars().all()

    return [ChildAccountRead.model_validate(account) for account in child_accounts]


@router.get(
    "/{child_account_id:int}",
    response_model=ChildAccountRead,
    summary="Получить детский аккаунт по идентификатору",
)
async def get_child_account(
    child_account_id: int,
    db: AsyncSession = Depends(get_db),
) -> ChildAccountRead:
    child_account = await db.scalar(
        select(ChildAccount).where(ChildAccount.id == child_account_id)
    )
    if not child_account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Детский аккаунт не найден",
        )

    return ChildAccountRead.model_validate(child_account)


@router.put(
    "/{child_account_id:int}",
    response_model=ChildAccountRead,
    summary="Обновить детский аккаунт",
)
async def update_child_account(
    child_account_id: int,
    payload: ChildAccountUpdate,
    db: AsyncSession = Depends(get_db),
) -> ChildAccountRead:
    child_account = await db.scalar(
        select(ChildAccount).where(ChildAccount.id == child_account_id)
    )
    if not child_account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Детский аккаунт не найден",
        )

    if payload.child_name is not None:
        child_account.child_name = payload.child_name
    if payload.balance is not None:
        child_account.balance = payload.balance
    if payload.bank_id is not None:
        # Проверка существования банка при обновлении
        bank = await db.scalar(select(Bank).where(Bank.id == payload.bank_id))
        if not bank:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Банк не найден",
            )
        child_account.bank_id = payload.bank_id

    await db.commit()
    await db.refresh(child_account)

    return ChildAccountRead.model_validate(child_account)


@router.delete(
    "/{child_account_id:int}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удалить детский аккаунт",
)
async def delete_child_account(
    child_account_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    child_account = await db.scalar(
        select(ChildAccount).where(ChildAccount.id == child_account_id)
    )
    if not child_account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Детский аккаунт не найден",
        )

    await db.delete(child_account)
    await db.commit()

