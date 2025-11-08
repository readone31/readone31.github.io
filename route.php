use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegController;

Route::get('/', [RegController::class, 'index']);
Route::pos('/submit',[regController::class, 'submit']);
