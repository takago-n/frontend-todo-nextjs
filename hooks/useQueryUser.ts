import { useRouter } from 'next/router'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { User } from '@prisma/client'

export const useQueryUser = () => {
  // useRouter フックを使用して router オブジェクトを取得
  const router = useRouter()

  // getUser 関数を定義
  const getUser = async () => {
    // axios を使用して API からユーザー情報を取得
    const { data } = await axios.get<Omit<User, 'hashedPassword'>>(
      `${process.env.NEXT_PUBLIC_API_URL}/user`,
    )
    return data
  }

  // useQuery フックを使用してデータの取得を行う
  return useQuery<Omit<User, 'hashedPassword'>, Error>({
    queryKey: ['user'], // クエリの一意なキー
    queryFn: getUser, // データを取得する関数
    onError: (err: any) => {
      // エラーハンドリング: 認証エラー時にルートページにリダイレクト
      if (err.response.status === 401 || err.response.status === 403) {
        router.push('/')
      }
    },
  })
}
