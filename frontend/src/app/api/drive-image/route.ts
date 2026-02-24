import { NextRequest, NextResponse } from 'next/server';

// JPEG starts with FF D8, PNG starts with 89 50 4E 47, WEBP starts with 52 49 46 46
function detectImageType(buffer: ArrayBuffer): string | null {
    const arr = new Uint8Array(buffer);
    if (arr[0] === 0xFF && arr[1] === 0xD8) return 'image/jpeg';
    if (arr[0] === 0x89 && arr[1] === 0x50 && arr[2] === 0x4E && arr[3] === 0x47) return 'image/png';
    if (arr[0] === 0x52 && arr[1] === 0x49 && arr[2] === 0x46 && arr[3] === 0x46) return 'image/webp';
    if (arr[0] === 0x47 && arr[1] === 0x49 && arr[2] === 0x46) return 'image/gif';
    return null;
}

export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
    };

    try {
        // Try multiple Google Drive URL formats
        const urls = [
            `https://drive.google.com/thumbnail?id=${id}&sz=w800`,
            `https://drive.google.com/uc?export=view&id=${id}`,
            `https://lh3.googleusercontent.com/d/${id}=s800`,
        ];

        for (const url of urls) {
            try {
                const response = await fetch(url, { redirect: 'follow', headers });

                if (!response.ok) continue;

                const buffer = await response.arrayBuffer();
                const contentType = response.headers.get('content-type') || '';

                // Check Content-Type header first
                if (contentType.startsWith('image/')) {
                    return new NextResponse(buffer, {
                        status: 200,
                        headers: {
                            'Content-Type': contentType,
                            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
                            'Access-Control-Allow-Origin': '*',
                        },
                    });
                }

                // Google sometimes returns image data with text/html Content-Type
                // Detect actual image type from magic bytes
                const detectedType = detectImageType(buffer);
                if (detectedType) {
                    return new NextResponse(buffer, {
                        status: 200,
                        headers: {
                            'Content-Type': detectedType,
                            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
                            'Access-Control-Allow-Origin': '*',
                        },
                    });
                }
            } catch {
                continue;
            }
        }

        // If all URLs fail, redirect to generated avatar
        const name = request.nextUrl.searchParams.get('name') || 'User';
        return NextResponse.redirect(
            `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=400&bold=true`
        );
    } catch {
        return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
    }
}
