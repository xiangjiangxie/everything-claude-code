---
paths:
  - "**/*.kt"
  - "**/*.kts"
---
# Kotlin 模式

> 本文件以 Kotlin 和 Android/KMP 特定内容扩展了 [common/patterns.md](../common/patterns.md)。

## 依赖注入

优先使用构造函数注入。使用 Koin（KMP）或 Hilt（仅 Android）：

```kotlin
// Koin — 声明模块
val dataModule = module {
    single<ItemRepository> { ItemRepositoryImpl(get(), get()) }
    factory { GetItemsUseCase(get()) }
    viewModelOf(::ItemListViewModel)
}

// Hilt — 注解
@HiltViewModel
class ItemListViewModel @Inject constructor(
    private val getItems: GetItemsUseCase
) : ViewModel()
```

## ViewModel 模式

单一状态对象、事件接收器、单向数据流：

```kotlin
data class ScreenState(
    val items: List<Item> = emptyList(),
    val isLoading: Boolean = false
)

class ScreenViewModel(private val useCase: GetItemsUseCase) : ViewModel() {
    private val _state = MutableStateFlow(ScreenState())
    val state = _state.asStateFlow()

    fun onEvent(event: ScreenEvent) {
        when (event) {
            is ScreenEvent.Load -> load()
            is ScreenEvent.Delete -> delete(event.id)
        }
    }
}
```

## 仓库模式

- `suspend` 函数返回 `Result<T>` 或自定义错误类型
- `Flow` 用于响应式流
- 协调本地 + 远程数据源

```kotlin
interface ItemRepository {
    suspend fun getById(id: String): Result<Item>
    suspend fun getAll(): Result<List<Item>>
    fun observeAll(): Flow<List<Item>>
}
```

## UseCase 模式

单一职责，`operator fun invoke`：

```kotlin
class GetItemUseCase(private val repository: ItemRepository) {
    suspend operator fun invoke(id: String): Result<Item> {
        return repository.getById(id)
    }
}

class GetItemsUseCase(private val repository: ItemRepository) {
    suspend operator fun invoke(): Result<List<Item>> {
        return repository.getAll()
    }
}
```

## expect/actual（KMP）

用于平台特定实现：

```kotlin
// commonMain
expect fun platformName(): String
expect class SecureStorage {
    fun save(key: String, value: String)
    fun get(key: String): String?
}

// androidMain
actual fun platformName(): String = "Android"
actual class SecureStorage {
    actual fun save(key: String, value: String) { /* EncryptedSharedPreferences */ }
    actual fun get(key: String): String? = null /* ... */
}

// iosMain
actual fun platformName(): String = "iOS"
actual class SecureStorage {
    actual fun save(key: String, value: String) { /* Keychain */ }
    actual fun get(key: String): String? = null /* ... */
}
```

## 协程模式

- 在 ViewModel 中使用 `viewModelScope`，在结构化子任务中使用 `coroutineScope`
- 使用 `stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), initialValue)` 将冷 Flow 转换为 StateFlow
- 当子任务失败需要独立处理时使用 `supervisorScope`

## DSL 建造者模式

```kotlin
class HttpClientConfig {
    var baseUrl: String = ""
    var timeout: Long = 30_000
    private val interceptors = mutableListOf<Interceptor>()

    fun interceptor(block: () -> Interceptor) {
        interceptors.add(block())
    }
}

fun httpClient(block: HttpClientConfig.() -> Unit): HttpClient {
    val config = HttpClientConfig().apply(block)
    return HttpClient(config)
}

// 用法
val client = httpClient {
    baseUrl = "https://api.example.com"
    timeout = 15_000
    interceptor { AuthInterceptor(tokenProvider) }
}
```

## 参考

参阅技能：`kotlin-coroutines-flows` 了解详细的协程模式。
参阅技能：`android-clean-architecture` 了解模块和分层模式。
