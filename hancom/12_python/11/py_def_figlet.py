import pyfiglet

def good_sentence(sentence: str) -> None:
    """
    입력된 문자열을 pyfiglet 형식으로 출력
    
    파라미터 : sentence(str)
    반환 : None - 출력만 수행
    """

    py_sentence = pyfiglet.figlet_format(sentence)
    print(py_sentence)

good_sentence("Hello, Hancom")
#  _   _      _ _          _   _                                 
# | | | | ___| | | ___    | | | | __ _ _ __   ___ ___  _ __ ___  
# | |_| |/ _ \ | |/ _ \   | |_| |/ _` | '_ \ / __/ _ \| '_ ` _ \ 
# |  _  |  __/ | | (_) |  |  _  | (_| | | | | (_| (_) | | | | | |
# |_| |_|\___|_|_|\___( ) |_| |_|\__,_|_| |_|\___\___/|_| |_| |_|
#

good_sentence("Goof Bye")

#   ____              __   ____             
#  / ___| ___   ___  / _| | __ ) _   _  ___ 
# | |  _ / _ \ / _ \| |_  |  _ \| | | |/ _ \
# | |_| | (_) | (_) |  _| | |_) | |_| |  __/
#  \____|\___/ \___/|_|   |____/ \__, |\___|
#                                |___/      
