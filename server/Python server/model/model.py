import torch
from transformers import GPT2LMHeadModel, PreTrainedTokenizerFast
from fastapi import HTTPException

tokenizer = PreTrainedTokenizerFast.from_pretrained("skt/kogpt2-base-v2",
                                                    bos_token='</s>',
                                                    eos_token='</s>',
                                                    unk_token='<unk>',
                                                    pad_token='<pad>',
                                                    mask_token='<mask>')

# 2개 모델로 돌리고
# 하나만 있어서 일단 같은 파일로 했음
# map_location=torch.device('cpu'): cpu로 실행
model_open_obj = GPT2LMHeadModel.from_pretrained("skt/kogpt2-base-v2")
model_open_obj.load_state_dict(torch.load("./model/model_ok.pth", map_location=torch.device('cpu')))
model_open_obj.eval()

model_close_obj = GPT2LMHeadModel.from_pretrained("skt/kogpt2-base-v2")
model_close_obj.load_state_dict(torch.load("./model/model_no.pth", map_location=torch.device('cpu')))
model_close_obj.eval()

keywords = ['병뚜껑', '이물질', '쌍쌍바', '소매', '겉옷', '통화', '패딩', '립밤', '영화', '카풀', '향수', '허그', '장보기', '모임', '깻잎', '케익', '데려다', '조수석', '신발끈', '속옷 속옷', '상담', '게임', '서프라이즈', '위로', '듀엣', '옆방', '인스타', '치즈', '새우', '블루투스', '이어폰']


def model_open(data, keyword):
    try:
        col_keyword = keyword
        new_col_list = [word for word in keywords if word != col_keyword]

        found_words = [word for word in new_col_list if word in data]

        if found_words:
            munsory = "갑자기 왜 주제를 돌려. 바꾸고 싶으면 다른 질문 선택하기 눌러"
            return munsory

        else:
            input_text = col_keyword + ' ' + data
            print(input_text)
            input_ids = tokenizer.encode(input_text, return_tensors="pt")

            with torch.no_grad():
                output = model_open_obj.generate(input_ids,
                                        max_length=100,
                                        num_return_sequences=1,

                                        no_repeat_ngram_size=2,
                                        top_k=50,
                                        top_p=0.95,
                                        # do_sample=True,)
                                        num_beams=5)
                generated_text = tokenizer.decode(output[0], skip_special_tokens=True)
                print(generated_text)
                result_text = generated_text.replace(input_text, '').strip().split('\n')
                while True:
                    for i in range(len(result_text)): 
                        error_words = [word for word in new_col_list if word in result_text[i]]
                        if error_words:
                            pass
                        else:
                            answer = result_text[i]  
                            return answer
                        
                    answer = '에휴... 됐어 이래서 인간이랑 말이 안통한다니까~'
                    return answer
    except Exception as e:
        print(e)

def model_close(data, keyword):
    try:
        col_keyword = keyword
        new_col_list = [word for word in keywords if word != col_keyword]

        found_words = [word for word in new_col_list if word in data]

        if found_words:
            munsory = "갑자기 왜 주제를 돌려. 바꾸고 싶으면 다른 질문 선택하기 눌러"
            return munsory

        else:
            input_text = col_keyword + ' ' + data
            input_ids = tokenizer.encode(input_text, return_tensors="pt")

            # 현재 학습된 모델을 불어오면 500
            input_ids = tokenizer.encode(data, return_tensors="pt")
            with torch.no_grad():
                output = model_close_obj.generate(input_ids,
                                        max_length=100,
                                        num_return_sequences=5,
                                        no_repeat_ngram_size=2,
                                        top_k=50,
                                        top_p=0.95,
                                        num_beams=5)            
                generated_text = tokenizer.decode(output[0], skip_special_tokens=True)
                result_text = generated_text.replace(data, '').strip().split('\n')
                while True:
                    for i in range(len(result_text)): 
                        error_words = [word for word in new_col_list if word in result_text[i]]
                        if error_words:
                            pass
                        else:
                            answer = result_text[i]  
                            return answer
                        
                    answer = '에휴... 됐어 이래서 인간이랑 말이 안통한다니까~'
                    return answer
    except Exception as e:
        print(e)


