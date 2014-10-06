import wave, sys, sndhdr, json, struct

def convert(filename, outfilename):
    of = wave.open(outfilename,'w')
    ifi = open(filename,'r')
    bufferfl = json.loads(ifi.read())
    # ifi = open json file
    # set buffer to json file contents

    #print(bufferfl)

    wav_file = ''

    for val in bufferfl:
        wav_file += struct.pack("<f", val)

    of.setnchannels(1)
    of.setframerate(44100)
    of.setsampwidth(1)
    of.writeframes(wav_file)
    of.close()
    ifi.close()

if __name__ == "__main__":
    convert(sys.argv[1], sys.argv[2])
