#include <math.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>

float a, b, c, x, y, z, ooz, k1 = 40;
float cubeWidth = 20;
int width = 160, height = 44, distanciaCam = 100;
float zBuffer[160 * 44];
char buffer[160 * 44];
int backgroundASCIICode = ' ';
float incrementSpeed = 0.6;
int xp, yp, idx;

float calcularX(int i, int j, int k) // formulas de rotação de matriz
{
    return j * sin(a) * sin(b) * cos(c) - k * cos(a) * sin(b) * cos(c) + j * cos(a) * sin(c) + k * sin(a) * sin(c) + i * cos(b) * cos(c);
}

float calcularY(int i, int j, int k) // formulas de rotação de matriz
{
    return j * cos(a) * cos(c) + k * sin(a) * cos(c) - j * sin(a) * sin(b) * sin(c) + k * cos(a) * sin(b) * sin(c) - i * cos(b) * sin(c);
}

float calcularZ(int i, int j, int k) // formulas de rotação de matriz
{
    return k * cos(a) * cos(b) - j * sin(a) * cos(b) + i * sin(b);
}

void calcularSuperficie(float cubeX, float cubeY, float cubeZ, int c)
{
    x = calcularX(cubeX, cubeY, cubeZ);
    y = calcularY(cubeX, cubeY, cubeZ);
    z = calcularZ(cubeX, cubeY, cubeZ) + distanciaCam;

    ooz = 1 / z;
    xp = (int)(width / 2 + k1 * ooz * x * 2);
    yp = (int)(height / 2 + k1 * ooz * y);
    idx = xp + yp * width;

    if (idx >= 0 && idx < width * height)
    {
        if (ooz > zBuffer[idx])
        {
            zBuffer[idx] = ooz;
            buffer[idx] = c;
        }
    }
}

int main()
{
    printf("\x1b[2J");
    while (1)
    {
        memset(buffer, backgroundASCIICode, width * height);
        memset(zBuffer, 0, width * height * 4);
        for (float cubeX = -cubeWidth; cubeX < cubeWidth; cubeX += incrementSpeed)
        {
            for (float cubeY = -cubeWidth; cubeY < cubeWidth; cubeY += incrementSpeed)
            {
                calcularSuperficie(cubeX, cubeY, -cubeWidth, '.');
                calcularSuperficie(cubeWidth, cubeY, cubeX, '$');
                calcularSuperficie(-cubeWidth, cubeY, -cubeX, '~');
                calcularSuperficie(-cubeX, cubeY, cubeWidth, '~');
                calcularSuperficie(cubeX, -cubeWidth, -cubeY, ';');
                calcularSuperficie(cubeX, cubeWidth, cubeY, '+');
            }
        }
        printf("\x1b[H");
        for (int k = 0; k < width * height; k++)
        {
            putchar(k % width ? buffer[k] : 10);
        }
        a += 0.005;
        b += 0.005;
        usleep(100);
    }
    return 0;
}