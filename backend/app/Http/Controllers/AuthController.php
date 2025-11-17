<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            // FE kamu pakai "username", kita jadikan name + email dummy berbasis username
            'username' => ['required','string','max:100','unique:users,name'],
            'password' => ['required','string','min:6'], // samakan dg FE (6)
        ]);

        $user = User::create([
            'name'     => $validated['username'],
            // jika kamu tidak memakai email di FE, kita buat email dummy unik:
            'email'    => $validated['username'].'@local.invalid',
            'password' => $validated['password'], // otomatis hashed (cast)
        ]);

        $token = $user->createToken('web')->plainTextToken;

        return response()->json([
            'success' => true,
            'user'    => ['id'=>$user->id,'name'=>$user->name],
            'token'   => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'username' => ['required','string'],
            'password' => ['required','string'],
        ]);

        // Login berdasarkan name (karena FE kirim username)
        $user = User::where('name', $validated['username'])->first();
        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json(['success'=>false,'message'=>'Invalid credentials.'], 422);
        }

        // Opsional: revoke token lama
        $user->tokens()->delete();

        $token = $user->createToken('web')->plainTextToken;

        return response()->json([
            'success' => true,
            'user'    => ['id'=>$user->id,'name'=>$user->name],
            'token'   => $token,
        ]);
    }

    public function me(Request $request)
    {
        $u = $request->user();
        return response()->json([
            'success' => true,
            'user'    => ['id'=>$u->id,'name'=>$u->name],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['success'=>true,'message'=>'Logged out.']);
    }
}
