import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    // at "pending" is empty
    // at "fulfilled", has 'articles' (check in Redux devTools)
    articles: [],
    isLoading: true,
}

export const getArticles = createAsyncThunk(
    'articles/getArticles',
    async () => {
        try {
            return await fetch('/api/v1/getArticles')
            .then((resp) => resp.json())
            .catch((err) => console.log(err));
        } catch (error) {
            console.log(error);
        }
    }
)

const articlesSlice = createSlice({
    name: 'articles',
    initialState,
    reducers:{
        clearArticles:(state)=>{
            state.articles = []
        },
        createArticle: (state, action) => {
            state.articles = [action.payload, ...state.articles]
        },
        // id != ID
        removeArticle: (state, action) => {
            const itemId = action.payload
            state.articles = state.articles.filter((item)=> item.id !== itemId)
        },
    },
    extraReducers:(builder)=>{
        builder
            .addCase(getArticles.pending, (state) => {
                state.isLoading = true
            })
            // fulfilled mean it's successful and return articles
            // just have to set it in state 
            .addCase(getArticles.fulfilled, (state, action) => {
                state.isLoading = false
                state.articles = action.payload
            })
            .addCase(getArticles.rejected, (state, action) => {
                state.isLoading = false
            })
    }
})

export const { clearArticles, removeArticle, createArticle } = articlesSlice.actions
export default articlesSlice.reducer